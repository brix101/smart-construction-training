import type { LinkComponentProps } from "@tanstack/react-router";

import { Link } from "@tanstack/react-router";

import type { getCategoriesFn } from "~/server/function/category/category.function";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getRandomPatternStyle } from "~/lib/generate-pattern";

type Category = Awaited<ReturnType<typeof getCategoriesFn>>[number];

type CategoryCardProps = LinkComponentProps<"a"> & { category: Category };

export function CategoryCard({ category, ...props }: CategoryCardProps) {
  return (
    <Link {...props}>
      <span className="sr-only">{category.name}</span>
      <Card className="hover:bg-muted/50 h-full overflow-hidden transition-colors">
        <AspectRatio ratio={16 / 9}>
          <div className="to-foreground/70 absolute inset-0 bg-linear-to-t from-transparent" />
          {category.img ? (
            <img
              src={category.img}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="h-full rounded-t-md border-b"
              style={getRandomPatternStyle(category.id)}
            />
          )}
        </AspectRatio>
        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1">{category.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            With {category.courseCount} {category.courseCount === 1 ? "course" : "courses"}{" "}
            available.
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export function CategoryCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <div className="to-foreground/70 absolute inset-0 bg-linear-to-t from-transparent" />
        <Skeleton className="h-full w-full rounded-none" />
      </AspectRatio>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
    </Card>
  );
}
