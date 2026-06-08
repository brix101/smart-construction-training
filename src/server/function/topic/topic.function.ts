import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as Schema from "effect/Schema";

import { GetTopicSchema, type GetTopicInput } from "./topic.domain";
import { getTopicById } from "./topic.server";

export const getTopicByIdFn = createServerFn({ method: "GET" })
  .inputValidator(Schema.toStandardSchemaV1(GetTopicSchema))
  .handler(async ({ data, context }) => {
    const { id } = data;
    const topic = await context.runEffect(getTopicById({ id }));

    if (!topic) {
      throw new Error("Topic not found");
    }

    return topic;
  });

export const topicByIdQueryOptions = (params: GetTopicInput) =>
  queryOptions({
    queryKey: ["topic", params],
    queryFn: () => getTopicByIdFn({ data: params }),
  });
