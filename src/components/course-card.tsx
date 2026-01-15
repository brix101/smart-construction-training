import { Link } from '@tanstack/react-router'

import type { Course } from '@/server/db/schema'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getRandomPatternStyle } from '@/lib/generate-pattern'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id?: Course['id']
    imgSrc?: string
    name: string
    description?: string
  }
  href: string
  isDisabled?: boolean
}

export function CourseCard({ course, href, isDisabled }: CourseCardProps) {
  return (
    <Link
      to={href}
      className={cn(isDisabled && 'pointer-events-none')}
      aria-disabled={isDisabled}
    >
      <span className="sr-only">{course.name}</span>
      <Card className="hover:bg-muted/50 grid grid-cols-4 overflow-hidden py-0 transition-colors">
        <AspectRatio className="col-span-1" ratio={21 / 9}>
          <div className="to-background/70 absolute inset-0 bg-linear-to-t from-transparent" />
          {course.imgSrc ? (
            <img
              src={course.imgSrc}
              alt={course.name!}
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          ) : (
            <div
              className="h-full rounded-t-md border-b"
              style={getRandomPatternStyle(course.id!)}
            />
          )}
        </AspectRatio>
        <CardContent className="col-span-3 py-6">
          <CardHeader>
            <CardTitle className="line-clamp-1">{course.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {course.description
                ? course.description
                : `Explore ${course.name}`}
            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
    </Link>
  )
}

interface CourseCardSkeletonProps {
  hasBadge?: boolean
}

export function CourseCardSkeleton(props: CourseCardSkeletonProps) {
  return (
    <Card className="grid grid-cols-4 overflow-hidden py-0">
      <AspectRatio className="col-span-1" ratio={21 / 9}>
        <Skeleton
          className={cn(
            'absolute top-2 right-2 h-6 w-20 rounded-sm px-2 py-1',
            props.hasBadge ? 'visible' : 'invisible',
          )}
        />
        <Skeleton className="h-full w-full rounded-none" />
      </AspectRatio>
      <CardContent className="col-span-3 py-6">
        <CardHeader>
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
      </CardContent>
    </Card>
  )
}
