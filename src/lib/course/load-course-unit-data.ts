export type CourseUnitPayload = {
  id?: number;
  title: string;
  exercises: unknown[];
};

/**
 * Carga unidad desde asset estático (public/course-data).
 * Evita meter el contenido del curso en el bundle del Worker.
 */
export async function loadCourseUnitData(
  courseFolder: string,
  unitNumber: string | number
): Promise<CourseUnitPayload> {
  const n = String(unitNumber);
  const url = `/course-data/${courseFolder}/unit-${n}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${url} (${res.status})`);
  }
  const data = (await res.json()) as CourseUnitPayload;
  if (!Array.isArray(data.exercises)) {
    throw new Error(`JSON inválido en ${url}`);
  }

  // B1 unit 31 reading is sourced from the normalized Learning D1 database.
  if (courseFolder === "b1" && n === "31") {
    const readingResponse = await fetch("/api/learning/lessons/b1-31/exercises?section=reading", { cache: "no-store" });
    if (!readingResponse.ok) {
      throw new Error(`No se pudo cargar la lectura B1-31 desde Learning D1 (${readingResponse.status})`);
    }
    const readingData = await readingResponse.json() as { exercises?: unknown[] };
    const readingExercises = Array.isArray(readingData.exercises) ? readingData.exercises : [];
    if (!readingExercises.length) throw new Error("Learning D1 no devolvió ejercicios de lectura para B1-31.");
    const nonReading = data.exercises.filter((exercise: any) =>
      String(exercise?.topicName ?? exercise?.topic ?? "").toLowerCase() !== "reading"
    );
    data.exercises = [...nonReading, ...readingExercises];
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
