import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as Schema from "effect/Schema";

import { getCourses } from "./courses.server";

export const GetCoursesSchema = Schema.Struct({
  categoryId: Schema.String.check(Schema.isUUID()),
});

export type GetCoursesInput = typeof GetCoursesSchema.Type;

export const getCoursesFn = createServerFn({ method: "GET" })
  .inputValidator(Schema.toStandardSchemaV1(GetCoursesSchema))
  .handler(async ({ context, data }) => context.runEffect(getCourses(data)));

export const coursesQueryOptions = (params: GetCoursesInput) =>
  queryOptions({
    queryKey: ["courses", params],
    queryFn: () => getCoursesFn({ data: params }),
  });
