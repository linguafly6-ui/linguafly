export type CourseUnitPayload = {
  id?: number;
  title: string;
  exercises: unknown[];
};

/**
 * B1 content is served by COURSE_DB. Other levels keep their existing loader.
 */
export async function loadCourseUnitData(
  courseFolder: string,
  unitNumber: string | number
): Promise<CourseUnitPayload> {
  const n = String(unitNumber);

  if (courseFolder === "b1") {
    const lessonId = `b1-${n.padStart(2, "0")}`;
    const sections = ["grammar", "vocabulary", "reading", "listening"] as const;
    const responses = await Promise.all(sections.map(async (section) => {
      const response = await fetch(
        `/api/learning/lessons/${lessonId}/exercises?section=${section}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(`No se pudo cargar B1 unidad ${n}, sección ${section} desde COURSE_DB (${response.status})`);
      }
      return response.json() as Promise<{ title?: string; exercises?: unknown[] }>;
    }));

    const exercises = responses.flatMap((result) => Array.isArray(result.exercises) ? result.exercises : []);
    if (!exercises.length) {
      throw new Error(`COURSE_DB no contiene ejercicios publicados para B1 unidad ${n}`);
    }

    return {
      title: responses.find((result) => result.title)?.title ?? `Unidad ${n}`,
      exercises,
    };
  }

  const url = `/course-data/${courseFolder}/unit-${n}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${url} (${res.status})`);
  }
  const data = (await res.json()) as CourseUnitPayload;
  if (!Array.isArray(data.exercises)) {
    throw new Error(`JSON inválido en ${url}`);
  }
  return data;
}

export async function loadCourseFinalTest(
  courseFolder: string
): Promise<CourseUnitPayload> {
  const url = `/course-data/${courseFolder}/test-final.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${url} (${res.status})`);
  }
  const data = (await res.json()) as CourseUnitPayload;
  if (!Array.isArray(data.exercises)) {
    throw new Error(`JSON inválido en ${url}`);
  }
  return data;
}
