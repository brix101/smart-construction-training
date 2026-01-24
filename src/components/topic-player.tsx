import { useQuery } from '@tanstack/react-query'

import { DownloadButton, UploadButton } from '@/components/material-button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTRPC } from '@/lib/trpc'
import { getYouTubeId } from '@/lib/youtube'
import { Topic } from '@/server/db/schema'

interface TopicPlayerProps {
  topicId: Topic['id']
}

export function TopicPlayer({ topicId }: TopicPlayerProps) {
  const trpc = useTRPC()

  const { data: topic, isLoading } = useQuery(
    trpc.topics.getById.queryOptions({ topicId }),
  )

  if (isLoading) {
    return (
      <>
        <Skeleton className="mb-4 aspect-video w-full rounded-xl" />
        <Skeleton className="mt-10 mb-2 h-8 w-3/4" />
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-8 w-1/4 rounded-md" />
          <Skeleton className="h-8 w-1/4 rounded-md" />
        </div>
      </>
    )
  }

  if (!topic) {
    return <div>NotFound...</div>
  }

  const youtubeId = getYouTubeId(topic.youtubeUrl)

  return (
    <>
      <Card className="w-full overflow-hidden py-0">
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

      <div className="mb-4 flex items-center gap-2">
        <DownloadButton materials={topic.materials} />
        <UploadButton materials={topic.materials} />
      </div>
    </>
  )
}
