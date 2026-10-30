import { NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CourseInteraction = {
  interaction_id?: string;
  type?: string;
  prompt_es?: string;
  question_en?: string;
  stimulus_en?: string;
  main_text?: string;
  transcript?: string;
  options?: Array<{ id?: string; text?: string }>;
  correct_answer?: unknown;
  acceptable_answers?: string[];
  explanation?: string;
  pairs?: Array<{ id?: string; left: string; right: string }>;
  gaps?: Array<{ id: string; options: Array<{ id?: string; text?: string }> }>;
  [key: string]: unknown;
};

type CourseUnitJson = {
  course?: { unit_id?: string; unit_title?: string; level?: string };
  blocks?: Array<{ title?: string; content?: CourseInteraction[] }>;
};

function sectionFor(item: CourseInteraction, blockTitle: string): string {
  // C2 catalog IDs are authoritative: l1 grammar, l2 vocabulary/context,
  // l3 reading, l4 listening, l5 writing, l6 speaking.
  const lessonMatch = /^c2-u\\d+-l([1-6])-\\d+$/i.exec(String(item.interaction_id ?? ""));
  if (lessonMatch) {
    const lessonSections: Record<string, string> = {
      "1": "grammar",
      "2": "vocabulary",
      "3": "reading",
      "4": "listening",
      "5": "writing",
      "6": "speaking",
    };
    return lessonSections[lessonMatch[1]];
  }

  const tags = Array.isArray(item.concept_tags) ? item.concept_tags.join(" ") : "";
  const source = [tags, item.mastery_tag, blockTitle, item.type].join(" ").toLowerCase();
  if (/listening|audio|listen/.test(source)) return "listening";
  if (/reading|comprehension|read/.test(source)) return "reading";
  if (/vocab|idiom|collocation|word.?formation/.test(source)) return "vocabulary";
  if (/speaking/.test(source)) return "speaking";
  if (/writing|production/.test(source)) return "writing";
  return "grammar";
}

function correctOptionIndex(answer: unknown, options: Array<{ id?: string; text?: string }>): number | string | boolean | undefined {
  if (typeof answer === "boolean" || typeof answer === "number") return answer;
  if (typeof answer !== "string") return undefined;
  const index = options.findIndex((option) => option.id === answer);
  return index >= 0 ? index : answer;
}

function makeQuestion(
  item: CourseInteraction,
  prompt: string,
  options: Array<{ id?: string; text?: string }> = item.options ?? [],
  answer: unknown = item.correct_answer
) {
  const mappedOptions = options.map((option) => String(option.text ?? ""));
  const correctAnswer = correctOptionIndex(answer, options);
  return {
    question: prompt,
    type: /true.?false/i.test(String(item.type)) ? "true-false" : mappedOptions.length ? "multiple-choice" : "open-answer",
    ...(mappedOptions.length ? { options: mappedOptions } : {}),
    ...(correctAnswer !== undefined ? { correctAnswer } : {}),
    ...(Array.isArray(item.acceptable_answers) ? { acceptableAnswers: item.acceptable_answers } : {}),
    ...(typeof item.explanation === "string" ? { explanation: item.explanation } : {}),
  };
}

function toExercise(item: CourseInteraction, blockTitle: string, index: number) {
  const section = sectionFor(item, blockTitle);
  const type = String(item.type ?? "").toLowerCase();
  const instruction = typeof item.prompt_es === "string" ? item.prompt_es : "";
  const stimulus = typeof item.stimulus_en === "string" ? item.stimulus_en : "";
  const questionText = typeof item.question_en === "string" ? item.question_en : "";
  const prompt = [stimulus || questionText, instruction].filter(Boolean).join("\n");

  let questions: ReturnType<typeof makeQuestion>[] = [];
  if (/matching|match/i.test(type) && Array.isArray(item.pairs)) {
    const allRight = item.pairs.map((pair) => pair.right);
    questions = item.pairs.map((pair) => ({
      question: pair.left,
      type: "multiple-choice",
      options: allRight,
      correctAnswer: allRight.indexOf(pair.right),
      ...(typeof item.explanation === "string" ? { explanation: item.explanation } : {}),
    }));
  } else if (Array.isArray(item.gaps) && item.gaps.length) {
    questions = item.gaps.map((gap) => {
      const options = gap.options ?? [];
      const answerMap = item.correct_answer && typeof item.correct_answer === "object"
        ? item.correct_answer as Record<string, unknown> : {};
      const line = String(item.main_text ?? "").split("\n")
        .find((part) => new RegExp("^\\s*" + Number(gap.id) + "\\.").test(part)) ?? "";
      return makeQuestion(item, line.replace(/^\s*\d+\.\s*/, "") || prompt, options, answerMap[gap.id]);
    });
  } else if (/cloze|fill.?blanks?/i.test(type) && Array.isArray(item.correct_answer) && item.correct_answer.length) {
    const passage = String(item.main_text ?? "");
    const sentences = passage.split(/(?<=[.!?])\s+/);
    questions = item.correct_answer.map((answer, answerIndex) => {
      const marker = answerIndex + 1;
      const sentence = sentences.find((part) =>
        new RegExp("\\(" + marker + "\\)|\\[" + marker + "\\]|\\b" + marker + "\\b").test(part)
      ) ?? passage;
      const questionText = sentence.replace(
        new RegExp("\\(?" + marker + "\\)?\\s*(?:_+|\\(\\s*" + marker + "\\s*\\)_+)", "g"),
        "_____"
      );
      return makeQuestion(item, questionText || prompt || instruction, [], answer);
    });
  } else {
    questions = [makeQuestion(item, prompt || instruction || stimulus || questionText)];
  }

  const exerciseType = /true.?false/i.test(type) ? "true-false"
    : /fill.?blank|open.?cloze|cloze|gap.?fill/i.test(type) ? "fill-blank"
    : /reading/i.test(type) ? "reading-comprehension"
    : /listening/i.test(type) ? "listening-comprehension"
    : /sentence.?building/i.test(type) ? "sentence-building"
    : questions.some((question) => Array.isArray(question.options)) ? "multiple-choice"
    : "open-answer";

  return {
    id: String(item.interaction_id ?? `c2-exercise-${index + 1}`),
    type: exerciseType,
    level: "C2",
    topic: section,
    topicName: section,
    transcript: typeof item.transcript === "string" ? item.transcript
      : section === "reading" || section === "listening" ? String(item.main_text ?? "") : undefined,
    content: {
      instructions: instruction,
      ...(typeof item.main_text === "string" ? { text: item.main_text } : {}),
      questions,
    },
  };
}

/**
 * GET /api/courses/c2/units/:unitNumber
 * The canonical course JSON is read from the Cloudflare D1 binding. There is
 * deliberately no TypeScript/static-catalog fallback: a missing D1 row is an
 * explicit error so preview cannot silently serve stale bundled content.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ unitNumber: string }> }
) {
  const { unitNumber } = await context.params;
  if (!/^\d{1,3}$/.test(unitNumber)) {
    return NextResponse.json({ error: "Número de unidad no válido." }, { status: 400 });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const row = await env.DB.prepare(
      `SELECT unit_id, title, content_json
       FROM learning_course_json_units
       WHERE course_key = ? AND level = ? AND unit_number = ?
       LIMIT 1`
    ).bind("ingles-c2", "C2", Number(unitNumber)).first<{
      unit_id: string;
      title: string;
      content_json: string;
    }>();

    if (!row) {
      return NextResponse.json(
        { error: `La unidad C2 ${unitNumber} no existe en el D1 de preview.` },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    const source = JSON.parse(row.content_json) as CourseUnitJson;
    if (!Array.isArray(source.blocks)) {
      return NextResponse.json({ error: "El contenido C2 de D1 tiene un formato no válido." }, { status: 500 });
    }

    const exercises = source.blocks.flatMap((block) =>
      (Array.isArray(block.content) ? block.content : []).map((item, index) =>
        toExercise(item, String(block.title ?? ""), index)
      )
    );

    return NextResponse.json(
      { id: Number(unitNumber), title: row.title, exercises },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[api/courses/c2/units] D1 read failed:", error);
    return NextResponse.json(
      { error: "No se pudo leer el contenido C2 desde D1." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
