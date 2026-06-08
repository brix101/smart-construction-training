import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Card } from "~/components/ui/card";
import { getYouTubeId } from "~/lib/youtube";
import { topicByIdQueryOptions } from "~/server/function/topic/topic.function";

export const Route = createFileRoute("/_app/c/$courseId/$topicId")({
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(
      topicByIdQueryOptions({
        id: params.topicId,
      }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { topicId } = Route.useParams();
  const { data: topic } = useSuspenseQuery(topicByIdQueryOptions({ id: topicId }));

  const youtubeId = getYouTubeId(topic.youtubeUrl);

  return (
    <div>
      <Card className="w-full overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0&autoplay=0&controls=1&disablekb=1&fs=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            title={topic.name}
          />
        </AspectRatio>
      </Card>
      <h1 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        {topic.name}
      </h1>
    </div>
  );
}
