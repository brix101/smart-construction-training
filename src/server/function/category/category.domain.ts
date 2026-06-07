import * as Schema from "effect/Schema";

export const GetCategorySchema = Schema.Struct({
  id: Schema.String.check(Schema.isUUID()),
});

export type GetCategoryInput = typeof GetCategorySchema.Type;
