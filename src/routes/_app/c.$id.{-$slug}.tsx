import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, PlayIcon } from 'lucide-react'
import z from 'zod'

import { CategoryHeaderSkeleton } from '@/components/category-header'
import { CourseCard, CourseCardSkeleton } from '@/components/course-card'
import { TopicPlayer, TopicPlayerSkeleton } from '@/components/topic-player'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Course } from '@/server/db/schema'

const searchSchema = z.object({
  topic: z.string().optional(),
})

export const Route = createFileRoute('/_app/c/$id/{-$slug}')({
  validateSearch: searchSchema,
  loader: async ({ params, context: { queryClient, trpc } }) => {
    const category = await queryClient.ensureQueryData(
      trpc.categories.getById.queryOptions({ categoryId: params.id }),
    )

    let course = null
    if (params.slug) {
      course = await queryClient.ensureQueryData(
        trpc.courses.getById.queryOptions({ id: params.slug }),
      )
    }

    if (!category) {
      throw notFound({
        data: 'Category not found',
      })
    }

    return { category, course }
  },
  pendingComponent: () => (
    <>
      <CategoryHeaderSkeleton />
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </>
  ),
  errorComponent: function ErrorComponent(error) {
    console.log(error)
    return <div>Error loading category: {String(error.error)} </div>
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id, slug } = Route.useParams()
  const { category, course } = Route.useLoaderData()

  if (slug && course) {
    return <CourseContainer course={course} />
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="line-clamp-1 text-xl font-bold md:text-2xl">
          {category?.name}
        </h2>
        <Separator className="my-1.5" />
      </div>

      <CoursesContainer categoryId={id} />
    </>
  )
}

function CoursesContainer({ categoryId }: { categoryId: string }) {
  const { trpc } = Route.useRouteContext()

  const { data: courses, isLoading } = useQuery(
    trpc.courses.getByCategoryId.queryOptions({ categoryId }),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {courses?.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            id: course.id!,
            name: course.name!,
            description: course.description!,
            imgSrc: course.imgSrc!,
          }}
          href={`/c/${categoryId}/${course.id}`}
        />
      ))}
    </div>
  )
}

function CourseContainer({ course }: { course: Course }) {
  const { id } = Route.useParams()
  const search = Route.useSearch()

  const { trpc } = Route.useRouteContext()
  const { data, isLoading } = useQuery(
    trpc.topics.getByCourseId.queryOptions({ courseId: course.id! }),
  )

  const topics = data || []
  const topicId = search.topic ?? topics[0]?.id

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TopicPlayerSkeleton />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="mb-6 h-10 w-1/4" />
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Separator className="mb-4" />
          <div className="h-[calc(100vh-10rem)]">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TopicPlayer topicId={topicId} />
        </div>
        <div className="lg:col-span-4">
          <Link
            to="/c/$id/{-$slug}"
            params={{ id, slug: '' }}
            className={cn('mb-6', buttonVariants({}))}
          >
            <ArrowLeft className="w-8" />
            <h3 className="">Back to Courses</h3>
          </Link>
          <h3 className="line-clamp-1 text-lg font-semibold overflow-ellipsis">
            {course.name}
          </h3>
          <Separator className="mb-4" />
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="flex flex-col gap-2">
              {topics.map((topic) => {
                const isActive = topic.id === topicId

                return (
                  <Link
                    aria-label={topic.name}
                    key={topic.id}
                    to="/c/$id/{-$slug}"
                    params={{ id, slug: course.id }}
                    search={{ topic: topic.id }}
                  >
                    <span
                      className={cn(
                        'group hover:bg-muted hover:text-foreground flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-1',
                        isActive
                          ? 'bg-muted text-foreground font-medium'
                          : 'text-muted-foreground',
                      )}
                    >
                      <div className={cn(isActive ? '' : 'invisible')}>
                        <PlayIcon className="w-4" />
                      </div>
                      <span className="line-clamp-1 overflow-ellipsis">
                        {topic.name}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
