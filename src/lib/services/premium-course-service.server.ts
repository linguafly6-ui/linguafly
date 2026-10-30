import { UnitData, PremiumInteraction, PremiumBlock, A1CourseMetadata, UnitMetadata } from '@/types/premium-course';
import { UserPerformanceRecord } from '../course-engine/adaptive';
import { extractUnitMetadata } from '@/lib/utils/course-metadata';
import { resolveCloudflareEnv } from '@/lib/db/client';
import fs from 'fs';
import path from 'path';

export type CourseLevel = string;

export const premiumCourseServerService = {
  /**
   * Fetches SRS performance data for a set of interactions from the server.
   */
  async getSRSPerformance(userId: string, interactionIds: string[]): Promise<UserPerformanceRecord[]> {
    void userId; void interactionIds;
    return [];
  },

  /**
   * Fetches user mastery data for all concepts.
   */
  async getUserMastery(userId: string): Promise<any[]> {
    void userId;
    return [];
  },

  /**
   * Loads all interactions for a specific level.
   * Loads interactions from local JSON course files.
   */
  async getAllInteractions(level: CourseLevel): Promise<PremiumInteraction[]> {
    // Local JSON files only
    const contentDir = path.join(process.cwd(), `src/content/cursos/${level}`);
    const interactions: PremiumInteraction[] = [];

    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => {
          const getNum = (s: string) => {
            const match = s.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getNum(a) - getNum(b);
        });

      files.forEach((file, unitIdx) => {
        try {
          const filePath = path.join(contentDir, file);
          const unitData: UnitData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const unitId = unitData.course.unit_id;
          const unitOrder = unitIdx + 1;
          
          unitData.blocks.forEach((block: PremiumBlock) => {
            block.content.forEach((content: any) => {
              if (content.interaction_id) {
                interactions.push({
                  ...content,
                  unit_id: unitId,
                  unit_order: unitOrder
                } as PremiumInteraction);
              } else if (content.video && content.video.interactions) {
                content.video.interactions.forEach((i: any) => {
                  interactions.push({
                    ...i,
                    unit_id: unitId,
                    unit_order: unitOrder
                  } as PremiumInteraction);
                });
              }
            });
          });
        } catch (error) {
          console.error(`Error loading interactions from ${file}:`, error);
        }
      });
      return interactions;
    }

    return [];
  },

  /**
   * Loads all units with their metadata and interaction counts.
   */
  async getUnits(level: CourseLevel) {
    const contentDir = path.join(process.cwd(), `src/content/cursos/${level}`);
    const units: any[] = [];

    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => {
          const getNum = (s: string) => {
            const match = s.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getNum(a) - getNum(b);
        });

      for (const file of files) {
        try {
          const filePath = path.join(contentDir, file);
          const unitData: UnitData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          
          const unitId = unitData.course.unit_id;
          const interactionIds: string[] = [];
          unitData.blocks.forEach((block: PremiumBlock) => {
            block.content.forEach((content: any) => {
              if (content.interaction_id) {
                interactionIds.push(content.interaction_id);
              } else if (content.video && content.video.interactions) {
                interactionIds.push(...content.video.interactions.map((i: any) => i.interaction_id));
              }
            });
          });

          units.push({
            id: unitId,
            title: unitData.course.unit_title,
            file: file.replace('.json', ''),
            totalExercises: interactionIds.length,
            interactionIds
          });
        } catch (error) {
          console.error(`Error loading unit from ${file}:`, error);
        }
      }
    }

    return units;
  },

  async getUnitData(courseId: string, unitId: string): Promise<UnitData | null> {
    try {
      const contentDir = path.join(process.cwd(), 'src', 'content', 'cursos', courseId);
      // Try unitId as-is (e.g. unit-1), then unitN format (e.g. unit1) for B2 JSON naming
      const unitIdVariants = [unitId];
      const unitNumMatch = unitId.match(/unit-?(\d+)/i);
      if (unitNumMatch) unitIdVariants.push(`unit${unitNumMatch[1]}`);
      for (const id of unitIdVariants) {
        const contentPath = path.join(contentDir, `${id}.json`);
        if (fs.existsSync(contentPath)) {
          const fileContent = fs.readFileSync(contentPath, 'utf8');
          return JSON.parse(fileContent);
        }
      }

      // Then try in src/data/courses/ (legacy path)
      const filePath = path.join(process.cwd(), 'src', 'data', 'courses', courseId, `${unitId}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      }
      return null;
    } catch (e) {
      console.error('Error fetching unit data:', e);
      return null;
    }
  },

  async saveInteraction(interaction: Omit<PremiumInteraction, 'id' | 'created_at'>) {
    void interaction;
    return null;
  },

  async getAllA1Interactions(): Promise<PremiumInteraction[]> {
    return this.getAllInteractions('ingles-a1');
  },

  async getAllB1Interactions(): Promise<PremiumInteraction[]> {
    return this.getAllInteractions('ingles-b1');
  },

  async getAllB2Interactions(): Promise<PremiumInteraction[]> {
    return this.getAllInteractions('ingles-b2');
  },

  async getA1UnitsWithMetadata(): Promise<A1CourseMetadata> {
    return this.getUnitsWithMetadata('ingles-a1');
  },

  async getA2UnitsWithMetadata(): Promise<A1CourseMetadata> {
    return this.getUnitsWithMetadata('ingles-a2');
  },

  async getB1UnitsWithMetadata(): Promise<A1CourseMetadata> {
    return this.getUnitsWithMetadata('ingles-b1');
  },

  async getB2UnitsWithMetadata(): Promise<A1CourseMetadata> {
    return this.getUnitsWithMetadata('ingles-b2');
  },

  async getC1UnitsWithMetadata(): Promise<A1CourseMetadata> {
    return this.getUnitsWithMetadata('ingles-c1');
  },

  async getC2UnitsWithMetadata(): Promise<A1CourseMetadata> {
    const { env } = await resolveCloudflareEnv();
    const result = await env.DB.prepare(
      `SELECT content_json
       FROM learning_course_json_units
       WHERE course_key = ? AND level = ?
       ORDER BY unit_number ASC`
    ).bind('ingles-c2', 'C2').all<{ content_json: string }>();

    const units: UnitMetadata[] = [];
    let totalDuration = 0;
    for (const row of result.results ?? []) {
      const unitData: UnitData = JSON.parse(row.content_json);
      const metadata = extractUnitMetadata(unitData);
      units.push(metadata);
      totalDuration += metadata.estimatedDuration;
    }

    return { totalUnits: units.length, totalDuration, units };
  },

  async getUnitsWithMetadata(courseId: string): Promise<A1CourseMetadata> {
    const contentDir = path.join(process.cwd(), `src/content/cursos/${courseId}`);
    const units: UnitMetadata[] = [];
    let totalDuration = 0;

    if (!fs.existsSync(contentDir)) {
      console.warn(`[PremiumCourseService] Content directory not found: ${contentDir}`);
      return {
        totalUnits: 0,
        totalDuration: 0,
        units: []
      };
    }

    const files = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const getNum = (s: string) => {
          const match = s.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        return getNum(a) - getNum(b);
      });

    for (const file of files) {
      try {
        const filePath = path.join(contentDir, file);
        const unitData: UnitData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        const metadata = extractUnitMetadata(unitData);
        units.push(metadata);
        totalDuration += metadata.estimatedDuration;
      } catch (error) {
        console.error(`[PremiumCourseService] Error loading unit from ${file}:`, error);
      }
    }

    return {
      totalUnits: units.length,
      totalDuration,
      units
    };
  }
};
