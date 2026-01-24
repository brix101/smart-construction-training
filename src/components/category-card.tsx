import { Link } from '@tanstack/react-router'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getRandomPatternStyle } from '@/lib/generate-pattern'
import { RouterOutput } from '@/server/trpc/router/_app'

interface CategoryCardProps {
  category: RouterOutput['categories']['getAll'][0]
  href: string
}

export function CategoryCard({ category, href }: CategoryCardProps) {
  return (
    <Link to={href}>
      <span className="sr-only">{category.name}</span>
      <Card className="hover:bg-muted/50 h-full overflow-hidden transition-colors">
        <AspectRatio ratio={21 / 9}>
          {/* <div className="to-primary/50 absolute inset-0 bg-linear-to-t from-transparent" /> */}
          {category.imgSrc ? (
            <img
              src={category.imgSrc}
              alt={category.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="h-full border-b"
              style={getRandomPatternStyle(category.id)}
            />
          )}
        </AspectRatio>
        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1">{category.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            With {category.courseCount}{' '}
            {category.courseCount === 1 ? 'course' : 'courses'} available.
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

export function CategoryCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <AspectRatio ratio={21 / 9}>
        <Skeleton className="h-full w-full rounded-none" />
      </AspectRatio>
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
    </Card>
  )
}
