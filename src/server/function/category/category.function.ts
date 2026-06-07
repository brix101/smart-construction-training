import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as Schema from "effect/Schema";

import { GetCategorySchema, type GetCategoryInput } from "./category.domain";
import { getCategories, getCategoryById } from "./category.server";

export const getCategoriesFn = createServerFn({ method: "GET" }).handler(async ({ context }) =>
  context.runEffect(getCategories()),
);

export const getCategoryByIdFn = createServerFn({ method: "GET" })
  .inputValidator(Schema.toStandardSchemaV1(GetCategorySchema))
  .handler(async ({ data, context }) => {
    const { id } = data;
    const category = await context.runEffect(getCategoryById({ id }));

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  });

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: getCategoriesFn,
  });

export const categoryByIdQueryOptions = (params: GetCategoryInput) =>
  queryOptions({
    queryKey: ["categories", params],
    queryFn: () => getCategoryByIdFn({ data: params }),
  });
