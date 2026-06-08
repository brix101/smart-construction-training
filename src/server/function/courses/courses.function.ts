import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as Schema from "effect/Schema";

import { getCourse, getCourses } from "./courses.server";

export const GetCoursesSchema = Schema.Struct({
  categoryId: Schema.String.check(Schema.isUUID()),
});
export type GetCoursesInput = typeof GetCoursesSchema.Type;

export const GetCourseSchema = Schema.Struct({
  id: Schema.String.check(Schema.isUUID()),
});
export type GetCourseInput = typeof GetCourseSchema.Type;

export const getCoursesFn = createServerFn({ method: "GET" })
  .inputValidator(Schema.toStandardSchemaV1(GetCoursesSchema))
  .handler(async ({ context, data }) => context.runEffect(getCourses(data)));

export const coursesQueryOptions = (params: GetCoursesInput) =>
  queryOptions({
    queryKey: ["courses", params],
    queryFn: () => getCoursesFn({ data: params }),
  });

export const getCourseFn = createServerFn({ method: "GET" })
  .inputValidator(Schema.toStandardSchemaV1(GetCourseSchema))
  .handler(async ({ context, data }) => context.runEffect(getCourse(data)));

export const courseQueryOptions = (params: GetCourseInput) =>
  queryOptions({
    queryKey: ["course", params],
    queryFn: () => getCourseFn({ data: params }),
  });
