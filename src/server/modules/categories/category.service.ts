import { asc, countDistinct, eq } from "drizzle-orm"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import type { CategoryId } from "./category.schema"
import * as Database from "~/server/db"
import { categories, courseCategories } from "~/server/db/schema/schema"

import { Category, CategoryNotFound, LobbyCategory } from "./category.schema"

export class CategoryService extends Effect.Service<CategoryService>()(
  "CategoryService",
  {
    effect: Effect.gen(function* () {
      const db = yield* Database.Database

      const getAll = db
        .use((client) =>
          client
            .select({
              id: categories.id,
              name: categories.name,
              imgSrc: categories.imgSrc,
              count: countDistinct(courseCategories.courseId),
            })
            .from(categories)
            .leftJoin(
              courseCategories,
              eq(categories.id, courseCategories.categoryId)
            )
            .groupBy(categories.id, courseCategories.categoryId)
            .where(eq(categories.isActive, true))
            // .having(gte(countDistinct(courseCategories.courseId), 1))
            .orderBy(asc(categories.name))
        )
        .pipe(
          Effect.flatMap(Schema.decode(Schema.Array(LobbyCategory))),
          Effect.catchTags({
            DatabaseError: Effect.die,
            ParseError: Effect.die,
          })
        )

      const getById = Effect.fn("getById")(function* (id: CategoryId) {
        return yield* db
          .use((client) =>
            client.query.categories.findFirst({
              where: eq(categories.id, id),
            })
          )
          .pipe(
            Effect.flatMap(Effect.fromNullable),
            Effect.flatMap(Schema.decode(Category)),
            Effect.catchTags({
              DatabaseError: Effect.die,
              ParseError: Effect.die,
              NoSuchElementException: () =>
                Effect.fail(new CategoryNotFound({ id })),
            })
          )
      })

      return {
        getAll,
        getById,
      }
    }),
    dependencies: [Database.fromEnv],
  }
) {}
