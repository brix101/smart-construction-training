import { Link, type LinkComponentProps } from "@tanstack/react-router";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getRandomPatternStyle } from "~/lib/generate-pattern";

type CourseCardProps = LinkComponentProps<"a"> & { course: any };

export function CourseCard({ course, ...props }: CourseCardProps) {
  return (
    <Link {...props}>
      <span className="sr-only">{course.name}</span>
      <Card className="hover:bg-muted/50 grid grid-cols-4 overflow-hidden transition-colors">
        <AspectRatio className="col-span-1" ratio={21 / 9}>
          <div className="to-primary/70 absolute inset-0 bg-linear-to-t from-transparent" />
          {course.imgSrc ? (
            <img
              src={course.imgSrc}
              alt={course.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="h-full rounded-t-md border-b"
              style={getRandomPatternStyle(course.id!)}
            />
          )}
        </AspectRatio>
        <CardHeader className="col-span-3 space-y-2">
          <CardTitle className="line-clamp-1">{course.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {course.description ? course.description : `Explore ${course.name}`}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="grid grid-cols-4 overflow-hidden">
      <AspectRatio className="col-span-1" ratio={21 / 9}>
        <div className="to-primary/70 absolute inset-0 bg-linear-to-t from-transparent" />
        <Skeleton className="h-full w-full rounded-none" />
      </AspectRatio>
      <CardHeader className="col-span-3 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
    </Card>
  );
}
