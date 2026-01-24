import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
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
} from '@/components/ui/sheet'
import { useTRPC } from '@/lib/trpc'
import { CategoryUpdateInput, categoryUpdateSchema } from '@/schema/category'

import { useCategoryRowAction } from '../state'
import { CategoryForm } from './category-form'

export function CategoriesUpdateSheet() {
  const { rowAction, setRowAction } = useCategoryRowAction()

  const trpc = useTRPC()
  const qc = useQueryClient()

  const searchParams = useSearch({ from: '/_admin/dashboard/categories' })
  const categoriesKey = trpc.categories.list.queryKey(searchParams)

  const { isPending, mutate } = useMutation(
    trpc.categories.update.mutationOptions({
      onSuccess: (data) => {
        qc.setQueriesData({ queryKey: categoriesKey }, (prev: any) => {
          if (!prev) return prev
          const items = prev.items.map((item: any) =>
            item.id === data.id ? data : item,
          )
          return {
            ...prev,
            items,
          }
        })
        toast.success('Category updated successfully.')
        setRowAction(null)
        return data
      },
      onError: (error) => {
        const message =
          error?.message || 'An error occurred while updating the category.'
        toast.error(message)
      },
    }),
  )

  const item = rowAction?.rows[0]?.original

  const form = useForm<CategoryUpdateInput>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: {
      id: item?.id || '',
      name: item?.name || '',
      imgSrc: item?.imgSrc,
      description: item?.description,
    },
  })

  const props = {
    open: rowAction?.variant === 'update',
    onOpenChange: () => setRowAction(null),
  }

  React.useEffect(() => {
    if (props.open && item) {
      form.reset({
        id: item.id,
        name: item.name,
        imgSrc: item.imgSrc,
        description: item.description,
      })
    }
  }, [item, props.open])

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update category</SheetTitle>
          <SheetDescription>
            Update the category details and save the changes
          </SheetDescription>
        </SheetHeader>
        <CategoryForm<CategoryUpdateInput>
          form={form}
          onSubmit={(data) => mutate(data)}
        >
          <SheetFooter className="gap-2 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={isPending}>
              {isPending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Save
            </Button>
          </SheetFooter>
        </CategoryForm>
      </SheetContent>
    </Sheet>
  )
}
