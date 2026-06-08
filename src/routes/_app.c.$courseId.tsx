import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import * as Schema from "effect/Schema";
import { PlayIcon } from "lucide-react";
import React from "react";

import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { courseQueryOptions } from "~/server/function/courses/courses.function";

const SearchSchema = Schema.Struct({
  topicId: Schema.optional(Schema.String.check(Schema.isUUID())),
});

export const Route = createFileRoute("/_app/c/$courseId")({
  validateSearch: Schema.toStandardSchemaV1(SearchSchema),
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(
      courseQueryOptions({
        id: params.courseId,
      }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { courseId } = Route.useParams();
  const { data: course } = useSuspenseQuery(courseQueryOptions({ id: courseId }));

  if (course && course.topics.length) {
    const topicId = course.topics[0].id;
    navigate({
      to: `./${topicId}`,
      replace: true,
    });
  }

  return (
    <section className="container mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Outlet />
        </div>
        <div className="lg:col-span-4">
          <h3 className="mb-4 font-semibold">{course?.name}</h3>
          {/* <React.Suspense fallback={<TopicSidebarLoader />}> */}
          {/*   <TopicSideBar coursePromise={coursePromises} /> */}
          {/* </React.Suspense> */}

          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="flex flex-col gap-2">
              {course?.topics.map((topic) => {
                // const href = pathname.replace(topicId, topic.id)
                // const isActive = topic.id === topicId;

                return (
                  <Link
                    aria-label={topic.name}
                    key={topic.id}
                    to="/c/$courseId/$topicId"
                    params={{ courseId, topicId: topic.id }}
                  >
                    <span
                      className={cn(
                        "group hover:bg-muted hover:text-foreground flex w-full items-center rounded-md border border-transparent px-2 py-1",
                        // isActive ? "bg-muted text-foreground font-medium" : "text-muted-foreground",
                      )}
                    >
                      {/* <div className={cn(isActive ? "" : "invisible")}> */}
                      {/*   <PlayIcon className="w-8" /> */}
                      {/* </div> */}
                      <span className="line-clamp-1 text-ellipsis">{topic.name}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
