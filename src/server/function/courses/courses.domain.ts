import * as Schema from "effect/Schema";

export const GetCoursesSchema = Schema.Struct({
  categoryId: Schema.String.check(Schema.isUUID()),
});

export type GetCoursesInput = typeof GetCoursesSchema.Type;
