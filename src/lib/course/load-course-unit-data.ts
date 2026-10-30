export type CourseUnitPayload = {
  id?: number;
  title: string;
  exercises: unknown[];
};

/**
 * Loads C2 units from the Cloudflare D1-backed API. Other courses continue
 * using their existing public/course-data JSON assets.
 */
export async function loadCourseUnitData(
  courseFolder: string,
  unitNumber: string | number
): Promise<CourseUnitPayload> {
  const n = String(unitNumber);

  // C2 is served exclusively from the preview D1 binding through this API.
  // Do not add a bundled/static fallback: preview must show the database data.
  const isC2 = courseFolder.toLowerCase() === "c2";
  const url = isC2
    ? `/api/courses/c2/units/${encodeURIComponent(n)}`
    : `/course-data/${courseFolder}/unit-${n}.json`;
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
