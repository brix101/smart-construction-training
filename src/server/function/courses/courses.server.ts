import { eq, asc } from "drizzle-orm";
import * as Effect from "effect/Effect";

import { Database } from "~/server/Database";
import { courseCategories, courses } from "~/server/db/schema";

import type { GetCoursesInput } from "./courses.function";

export function getCourses({ categoryId }: GetCoursesInput) {
  return Effect.gen(function* () {
    const db = yield* Database;

    return yield* db.use((client) =>
      client
        .select({
          id: courses.id,
          name: courses.name,
          description: courses.description,
          level: courses.level,
          imgSrc: courses.imgSrc,
          isPublished: courses.isPublished,
          isActive: courses.isActive,
          sequence: courses.sequence,
          createdAt: courses.createdAt,
          updatedAt: courses.updatedAt,
        })
        .from(courseCategories)
        .leftJoin(courses, eq(courses.id, courseCategories.courseId))
        .orderBy(asc(courses.name))
        .where(eq(courseCategories.categoryId, categoryId)),
    );
  });
}
