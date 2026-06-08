import * as Effect from "effect/Effect";

import { Database } from "~/server/Database";

import type { GetTopicInput } from "./topic.domain";

export function getTopicById({ id }: GetTopicInput) {
  return Effect.gen(function* () {
    const db = yield* Database;

    const topic = yield* db.use((client) =>
      client.query.topics.findFirst({
        where(fields, operators) {
          return operators.and(operators.eq(fields.id, id), operators.eq(fields.isActive, true));
        },
        with: {
          materials: {
            with: {
              material: true,
            },
          },
        },
      }),
    );

    return topic ?? null;
  });
}
