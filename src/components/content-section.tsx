import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  href?: React.ComponentProps<typeof Link>["to"];
  linkText?: string;
  children: React.ReactNode;
  render?: React.ReactElement<{ className?: string; children?: React.ReactNode }>;
}

export function ContentSection({
  title,
  description,
  href,
  linkText = "View all",
  children,
  render,
  className,
  ...props
}: ContentSectionProps) {
  const gridClassName = "xs:grid-cols-2 grid gap-4 md:grid-cols-3 lg:grid-cols-4";

  const content = render ? (
    React.cloneElement(render, {
      className: cn(gridClassName, render.props.className),
      children,
    })
  ) : (
    <div className={gridClassName}>{children}</div>
  );

  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between gap-4">
        <div className="max-w-232 flex-1 space-y-1">
          <h2 className="font-heading text-3xl leading-[1.1] font-bold md:text-4xl">{title}</h2>
          {description ? (
            <p className="text-muted-foreground max-w-184 leading-normal text-balance sm:text-lg sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        {href && (
          <Button variant="outline" className="hidden sm:flex" render={<Link to={href} />}>
            {linkText}
            <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
            <span className="sr-only"> {linkText}</span>
          </Button>
        )}
      </div>
      <div className="space-y-8">
        {content}
        {href && (
          <Button
            variant="ghost"
            className="mx-auto flex w-fit sm:hidden"
            render={<Link to={href} />}
          >
            {linkText}
            <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
            <span className="sr-only"> {linkText}</span>
          </Button>
        )}
      </div>
    </section>
  );
}
