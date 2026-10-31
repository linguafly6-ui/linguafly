import { NextRequest, NextResponse } from 'next/server';
import { resolveCloudflareEnv } from '@/lib/db/client';

const B1_SECTIONS = ['grammar', 'vocabulary', 'reading', 'listening'] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;

    if (unitId === 'test-final') {
      const { env } = await resolveCloudflareEnv();
      if (!env.COURSE_DB) throw new Error('COURSE_DB binding is not configured.');
      const row = await env.COURSE_DB.prepare(
        "SELECT title, content_json FROM learning_course_json_units WHERE course_key = 'ingles-b1' AND level = 'B1' AND unit_number = 61 LIMIT 1"
      ).first<{ title: string; content_json: string }>();
      if (!row) {
        return NextResponse.json({ error: 'El test final B1 no está disponible en COURSE_DB.' }, { status: 404 });
      }
      const data = JSON.parse(row.content_json) as { exercises?: unknown[] };
      if (!Array.isArray(data.exercises) || !data.exercises.length) {
        return NextResponse.json({ error: 'El test final B1 almacenado en COURSE_DB no es válido.' }, { status: 500 });
      }
      return NextResponse.json({ title: row.title, exercises: data.exercises }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const unitNumber = Number(unitId.replace('unit-', ''));
    if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 60) {
      return NextResponse.json({ error: 'Unidad no encontrada en COURSE_DB.' }, { status: 404 });
    }

    const lessonId = `b1-${String(unitNumber).padStart(2, '0')}`;
    const sectionResults = await Promise.all(B1_SECTIONS.map(async (section) => {
      const url = new URL(
        `/api/learning/lessons/${lessonId}/exercises?section=${section}`,
        request.url
      );
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`No se pudo cargar la sección ${section} desde COURSE_DB.`);
      return response.json() as Promise<{ title?: string; exercises?: unknown[] }>;
    }));

    const exercises = sectionResults.flatMap((result) =>
      Array.isArray(result.exercises) ? result.exercises : []
    );
    if (!exercises.length) {
      return NextResponse.json({ error: 'No hay ejercicios publicados para esta unidad en COURSE_DB.' }, { status: 404 });
    }

    return NextResponse.json({
      title: sectionResults.find((result) => result.title)?.title ?? `Unidad ${unitNumber}`,
      exercises,
    });
  } catch (error) {
    console.error('[API course/b1] D1 read failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudo cargar la unidad desde COURSE_DB.' },
      { status: 500 }
    );
  }
}
