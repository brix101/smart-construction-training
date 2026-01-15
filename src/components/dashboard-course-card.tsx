import { Link } from '@tanstack/react-router'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getRandomPatternStyle } from '@/lib/generate-pattern'
import { cn } from '@/lib/utils'
import { Course } from '@/server/db/schema'

interface DashboardCourseCardProps {
  course: Partial<Course>
  href: string
}

export function DashboardCourseCard({
  course,
  href,
}: DashboardCourseCardProps) {
  return (
    <Link to={href}>
      <span className="sr-only">{course.name}</span>
      <Card className="hover:bg-muted/50 h-full overflow-hidden transition-colors">
        <AspectRatio ratio={21 / 9}>
          <div className="to-primary/70 absolute inset-0 bg-linear-to-t from-transparent" />
          <Badge
            className={cn(
              'pointer-events-none absolute top-2 right-2 rounded-sm px-2 py-0.5 font-semibold',
              course.isPublished
                ? 'border-green-600/20 bg-green-100 text-green-700'
                : 'border-red-600/10 bg-red-100 text-red-700',
            )}
          >
            {course.isPublished ? 'Published' : 'Unpublished'}
          </Badge>
          <div
            className="h-full rounded-t-md border-b"
            style={getRandomPatternStyle(course.id!)}
          />
        </AspectRatio>
        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1">{course.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {course.description ? course.description : `Explore ${course.name}`}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

export function DashboardCourseCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <AspectRatio ratio={21 / 9}>
        <Skeleton className="absolute top-2 right-2 h-6 w-20 rounded-sm px-2 py-1" />
        <Skeleton className="h-full w-full rounded-b-none" />
      </AspectRatio>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
    </Card>
  )
}
