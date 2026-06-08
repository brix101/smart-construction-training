import { eq, asc, and, sql } from "drizzle-orm";
import * as Effect from "effect/Effect";

import { Database } from "~/server/Database";
import { courseCategories, courses, topics } from "~/server/db/schema";

import type { GetCourseInput, GetCoursesInput } from "./courses.function";

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

export function getCourse({ id }: GetCourseInput) {
  return Effect.gen(function* () {
    const db = yield* Database;

    return yield* db.use((client) =>
      client.query.courses.findFirst({
        where: and(eq(courses.id, id)),
        with: {
          topics: {
            where: eq(topics.isActive, true),
            orderBy: sql`COALESCE(SUBSTRING(${topics.name} FROM '^(\\d+)')::INTEGER,99999999)`,
          },
          categories: true,
        },
      }),
    );
  });
}
