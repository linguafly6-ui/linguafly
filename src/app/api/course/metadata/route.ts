import { NextRequest, NextResponse } from 'next/server';
import { premiumCourseServerService } from '@/lib/services/premium-course-service.server';
import { resolveCloudflareEnv } from '@/lib/db/client';

async function loadCourseMetadata(courseId: string) {
  if (courseId === 'ingles-b1') {
    const { env } = await resolveCloudflareEnv();
    if (!env.COURSE_DB) throw new Error('COURSE_DB binding is not configured.');
    const result = await env.COURSE_DB.prepare(
      `SELECT u.id AS unit_id, u.unit_number, j.title
       FROM units u
       JOIN courses c ON c.id = u.course_id
       JOIN learning_course_json_units j
         ON j.course_key = 'ingles-b1' AND j.level = 'B1' AND j.unit_number = u.unit_number
       WHERE c.id = 'course-en-b1' AND u.unit_number BETWEEN 1 AND 60
       ORDER BY u.unit_number ASC`
    ).all<{ unit_id: string; unit_number: number; title: string }>();
    const units = result.results ?? [];
    return {
      totalUnits: units.length,
      units: units.map((unit) => ({
        unitId: unit.unit_id,
        unitNumber: unit.unit_number,
        title: unit.title,
      })),
    };
  }

  switch (courseId) {
    case 'ingles-a1':
      return premiumCourseServerService.getA1UnitsWithMetadata();
    case 'ingles-a2':
      return premiumCourseServerService.getA2UnitsWithMetadata();
    case 'ingles-b2':
      return premiumCourseServerService.getB2UnitsWithMetadata();
    case 'ingles-c1':
      return premiumCourseServerService.getC1UnitsWithMetadata();
    case 'ingles-c2':
      return premiumCourseServerService.getC2UnitsWithMetadata();
    default:
      return null;
  }
}

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get('courseId')?.trim();
  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
  }

  try {
    const metadata = await loadCourseMetadata(courseId);
    if (!metadata) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      courseId,
      totalUnits: metadata.totalUnits,
      units: metadata.units.map((unit) => ({
        unitId: unit.unitId,
        unitNumber: unit.unitNumber,
        title: unit.title,
      })),
    });
  } catch (error) {
    console.error('[api/course/metadata] Failed to load course metadata:', error);
    return NextResponse.json({ error: 'No se pudo cargar el catálogo del curso.' }, { status: 500 });
  }
}
