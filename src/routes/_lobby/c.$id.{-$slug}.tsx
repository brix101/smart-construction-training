import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, PlayIcon } from 'lucide-react'
import z from 'zod'

import { CategoryHeaderSkeleton } from '@/components/category-header'
import { CourseCard, CourseCardSkeleton } from '@/components/course-card'
import { Shell } from '@/components/shell'
import { TopicPlayer } from '@/components/topic-player'
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
import { cn } from '@/lib/utils'

const searchSchema = z.object({
  topicId: z.string().optional(),
})

export const Route = createFileRoute('/_lobby/c/$id/{-$slug}')({
  validateSearch: searchSchema,
  loader: async ({ params, context: { queryClient, trpc } }) => {
    const category = await queryClient.ensureQueryData(
      trpc.categories.getById.queryOptions({ categoryId: params.id }),
    )

    let course = null
    if (params.slug) {
      console.log('Loading course with slug:', params.slug)
      course = await queryClient.ensureQueryData(
        trpc.courses.getById.queryOptions({ courseId: params.slug }),
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
    <Shell>
      <CategoryHeaderSkeleton />
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </Shell>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { id, slug } = Route.useParams()
  const { category } = Route.useLoaderData()

  if (slug) {
    return <CourseContainer />
  }

  return (
    <Shell>
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
    </Shell>
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

function CourseContainer() {
  const { id } = Route.useParams()
  const { course } = Route.useLoaderData()
  const search = Route.useSearch()

  if (!course) {
    return <div>Course not found</div>
  }

  const topics = course.topics || []
  const topicId = search.topicId ?? topics[0]?.id

  return (
    <Shell>
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
                    search={{ topicId: topic.id }}
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
    </Shell>
  )
}
