import { countDistinct, eq, asc } from "drizzle-orm";
import * as Effect from "effect/Effect";

import { Database } from "~/server/Database";
import { categories, courseCategories } from "~/server/db/schema";

import type { GetCategoryInput } from "./category.domain";

export function getCategories() {
  return Effect.gen(function* () {
    const db = yield* Database;

    return yield* db.use((client) =>
      client
        .select({
          id: categories.id,
          name: categories.name,
          img: categories.imgSrc,
          description: categories.description,
          courseCount: countDistinct(courseCategories.courseId),
        })
        .from(categories)
        .leftJoin(courseCategories, eq(categories.id, courseCategories.categoryId))
        .groupBy(categories.id, courseCategories.categoryId)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.name)),
    );
  });
}

export function getCategoryById({ id }: GetCategoryInput) {
  return Effect.gen(function* () {
    const db = yield* Database;

    const category = yield* db.use((client) =>
      client.query.categories.findFirst({
        where(fields, operators) {
          return operators.and(operators.eq(fields.id, id), operators.eq(fields.isActive, true));
        },
      }),
    );

    return category ?? null;
  });
}
