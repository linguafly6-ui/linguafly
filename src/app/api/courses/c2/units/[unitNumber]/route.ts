import { NextResponse } from "next/server";
import { C2_COURSE } from "@/lib/course/c2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/courses/c2/units/:unitNumber
 *
 * Returns the authored C2 exercise objects in the shape expected by
 * ExerciseRenderer. The former client loader requested /course-data/c2/unit-N.json,
 * but those generated public assets are not checked into this repository.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ unitNumber: string }> }
) {
  const { unitNumber } = await context.params;
  if (!/^\d{1,3}$/.test(unitNumber)) {
    return NextResponse.json({ error: "Número de unidad no válido." }, { status: 400 });
  }

  const number = Number(unitNumber);
  const unit = C2_COURSE.units.find((candidate) => candidate.id === number);
  if (!unit) {
    return NextResponse.json({ error: "Unidad C2 no disponible." }, { status: 404 });
  }

  return NextResponse.json(
    { id: unit.id, title: unit.title, exercises: unit.exercises },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" } }
  );
}
