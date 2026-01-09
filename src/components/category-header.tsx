import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Category } from '@/server/db/schema'

interface CourseHeaderProps {
  category: Category
}

export function CategoryHeader({ category }: CourseHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="line-clamp-1 text-xl font-bold md:text-2xl">
        {category.name}
      </h2>
      <Separator className="my-1.5" />
    </div>
  )
}

export function CategoryHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Courses</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Skeleton className="h-5 w-28" />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          {/* <Skeleton className="h-4 w-44" /> */}
        </div>
        <Separator className="my-1.5" />
      </div>
    </div>
  )
}
