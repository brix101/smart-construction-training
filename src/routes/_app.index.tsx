import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as Schema from "effect/Schema";
import React from "react";

import { CategoryCard, CategoryCardSkeleton } from "~/components/categories/category-card";
import { CategoryHeaderSkeleton } from "~/components/categories/category-header";
import { ContentSection } from "~/components/content-section";
import { CourseCard, CourseCardSkeleton } from "~/components/courses/courses-card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  categoriesQueryOptions,
  categoryByIdQueryOptions,
} from "~/server/function/category/category.function";
import { coursesQueryOptions } from "~/server/function/courses/courses.function";

const SearchSchema = Schema.Struct({
  categoryId: Schema.optional(Schema.String.check(Schema.isUUID())),
});

export const Route = createFileRoute("/_app/")({
  validateSearch: Schema.toStandardSchemaV1(SearchSchema),
  loader: async ({ context: { queryClient }, location, params }) => {
    if (params.courseId) {
      return;
    }

    if (location.search.categoryId) {
      await queryClient.prefetchQuery(
        categoryByIdQueryOptions({
          id: location.search.categoryId,
        }),
      );
      await queryClient.prefetchQuery(
        coursesQueryOptions({
          categoryId: location.search.categoryId,
        }),
      );
    } else {
      await queryClient.prefetchQuery(categoriesQueryOptions());
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { categoryId } = Route.useSearch();

  if (categoryId) {
    return <CategoryContainer />;
  }

  return <CategoriesContainer />;
}

function CategoriesContainer() {
  return (
    <ContentSection title="Courses" description="Explore available courses for you">
      <React.Suspense
        fallback={Array.from({ length: 4 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      >
        <CategoriesContent />
      </React.Suspense>
    </ContentSection>
  );
}

function CategoriesContent() {
  const { data } = useSuspenseQuery(categoriesQueryOptions());

  return (
    <>
      {data?.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          to="."
          search={(search) => ({ ...search, categoryId: category.id })}
        />
      ))}
    </>
  );
}

function CategoryContainer() {
  return (
    <>
      <React.Suspense fallback={<CategoryHeaderSkeleton />}>
        <CategoryHeader />
      </React.Suspense>
      <React.Suspense
        fallback={
          <div className="flex flex-col gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <CategoryCourses />
      </React.Suspense>
    </>
  );
}

function CategoryHeader() {
  const { categoryId } = Route.useSearch();

  const { data } = useSuspenseQuery(
    categoryByIdQueryOptions({
      id: categoryId!,
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="line-clamp-1 text-xl font-bold md:text-2xl">{data.name}</h2>
      <Separator className="my-1.5" />
    </div>
  );
}

function CategoryCourses() {
  const { categoryId } = Route.useSearch();

  const { data } = useSuspenseQuery(
    coursesQueryOptions({
      categoryId: categoryId!,
    }),
  );

  return (
    <div className="flex flex-col gap-5">
      {data.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          to="/c/$courseId"
          params={{ courseId: course.id! }}
        />
      ))}
    </div>
  );
}
