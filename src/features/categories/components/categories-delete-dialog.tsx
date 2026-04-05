import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
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
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { pluralize } from '@/lib/pluralize'
import { useTRPC } from '@/lib/trpc'

import { useCategoryRowAction } from '../state'

function CategoriesDeleteDialog() {
  const { rowAction, setRowAction } = useCategoryRowAction()

  const trpc = useTRPC()
  const qc = useQueryClient()

  const isDesktop = useMediaQuery('(min-width: 640px)')

  const searchParams = useSearch({ from: '/_admin/dashboard/categories' })
  const categoriesKey = trpc.categories.list.queryKey(searchParams)

  const items = rowAction?.rows.map((row) => row.original) || []

  const { mutateAsync, isPending } = useMutation(
    trpc.categories.delete.mutationOptions({
      onSuccess: (data) => {
        qc.setQueriesData({ queryKey: categoriesKey }, (prev: any) => {
          if (!prev) return prev
          const items = prev.items.filter(
            (item: any) => item.id && !data.ids.includes(item.id),
          )
          return {
            ...prev,
            items,
          }
        })
        return data
      },
      onError: (error) => {
        const message =
          error?.message || 'An error occurred while deleting the category.'
        toast.error(message)
      },
    }),
  )

  function onDelete() {
    const ids = items.map((item) => item.id)

    toast.promise(mutateAsync({ ids }), {
      loading: `Deleting ${ids.length} ${pluralize('Category', ids.length)}...`,
      success: (response) => {
        rowAction?.rows.forEach((row) => row.toggleSelected(false))
        return response?.message || `Deleted successfully`
      },
      error: (error) => {
        return error?.message || 'Something went wrong'
      },
    })
    setRowAction(null)
  }

  const props = {
    open: rowAction?.variant === 'delete',
    onOpenChange: () => setRowAction(null),
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Deleting this{' '}
              <span className="font-bold">
                {pluralize('category', items.length)}{' '}
              </span>
              will remove it from active use.
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
