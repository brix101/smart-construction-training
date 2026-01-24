import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { CirclePlusIcon, Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useTRPC } from '@/lib/trpc'
import { CategoryCreateInput, categoryCreateSchema } from '@/schema/category'

import { CategoryForm } from './category-form'

export function CategoriesCreateSheet() {
  const [open, setOpen] = React.useState(false)

  const trpc = useTRPC()
  const qc = useQueryClient()

  const searchParams = useSearch({ from: '/_admin/dashboard/categories' })
  const categoriesKey = trpc.categories.list.queryKey(searchParams)

  const { mutateAsync, isPending } = useMutation(
    trpc.categories.create.mutationOptions(),
  )

  const form = useForm<CategoryCreateInput>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: '',
      imgSrc: '',
      description: '',
    },
  })

  function onSubmit(data: CategoryCreateInput) {
    mutateAsync(data)
      .then(() => {
        qc.invalidateQueries({ queryKey: categoriesKey })
        setOpen(false)
        form.reset()
      })
      .catch((error) => {
        const message =
          error?.message || 'An error occurred while creating the category.'
        toast.error(message)
      })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8">
          <CirclePlusIcon className="mr-2" />
          New
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Create category</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new category
          </SheetDescription>
        </SheetHeader>
        <CategoryForm form={form} onSubmit={onSubmit}>
          <SheetFooter className="gap-2 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={isPending}>
              {isPending && <Loader className="animate-spin" />}
              Create
            </Button>
          </SheetFooter>
        </CategoryForm>
      </SheetContent>
    </Sheet>
  )
}
