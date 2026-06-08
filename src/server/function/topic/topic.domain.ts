import * as Schema from "effect/Schema";

export const GetTopicSchema = Schema.Struct({
  id: Schema.String.check(Schema.isUUID()),
});

export type GetTopicInput = typeof GetTopicSchema.Type;
