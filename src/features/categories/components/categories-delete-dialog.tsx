import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { Loader, Trash } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useTRPC } from '@/integrations/trpc/react'
import { CategoryData } from '@/types/data'

interface DeleteCategoriesDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  items: Row<CategoryData>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

function CategoriesDeleteDialog({
  items,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCategoriesDialogProps) {
  const trpc = useTRPC()
  const qc = useQueryClient()

  const isDesktop = useMediaQuery('(min-width: 640px)')

  const searchParams = useSearch({ from: '/_admin/dashboard/categories' })
  const categoriesKey = trpc.categories.transaction.queryKey(searchParams)

  const { mutateAsync, isPending } = useMutation(
    trpc.categories.delete.mutationOptions(),
  )

  function onDelete() {
    const ids = items.map((item) => item.id)

    toast.promise(mutateAsync({ ids }), {
      loading: `Deleting ${ids.length} categories...`,
      success: (response) => {
        qc.invalidateQueries({
          queryKey: categoriesKey,
        })

        props.onOpenChange?.(false)
        onSuccess?.()
        return response?.message || 'Categories deleted successfully'
      },
      error: (error) => {
        return error?.message || 'Something went wrong'
      },
    })
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" />
              Delete ({items.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{' '}
              <span className="font-medium">{items.length}</span>
              {items.length === 1 ? ' category' : ' categories'} from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isPending}
            >
              {isPending && <Loader className="mr-2 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" />
            Delete ({items.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className="font-medium">{items.length}</span>
            {items.length === 1 ? ' category' : ' categories'} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending && <Loader className="mr-2 size-4 animate-spin" />}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CategoriesDeleteDialog
