import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  href?: string
  linkText?: string
  children: React.ReactNode
  asChild?: boolean
}

export function ContentSection({
  title,
  description,
  href,
  linkText = 'View all',
  children,
  className,
  asChild = false,
  ...props
}: ContentSectionProps) {
  const ChildrenShell = asChild ? Slot : 'div'

  return (
    <section className={cn('space-y-6', className)} {...props}>
      <div className="flex items-center justify-between gap-4">
        <div className="max-w-232 flex-1 space-y-1">
          <h2 className="font-heading text-3xl leading-[1.1] font-bold md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground max-w-184 leading-normal text-balance sm:text-lg sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        {href && (
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link to={href}>
              {linkText}
              <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
              <span className="sr-only"> {linkText}</span>
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-8">
        <ChildrenShell
          className={cn(
            !asChild &&
              'xs:grid-cols-2 grid gap-4 md:grid-cols-3 lg:grid-cols-4',
          )}
        >
          {children}
        </ChildrenShell>
        {href && (
          <Button
            variant="ghost"
            className="mx-auto flex w-fit sm:hidden"
            asChild
          >
            <Link to={href}>
              {linkText}
              <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
              <span className="sr-only"> {linkText}</span>
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}
