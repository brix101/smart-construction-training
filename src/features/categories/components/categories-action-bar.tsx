import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import type { Table } from '@tanstack/react-table'
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from '@/components/ui/action-bar'
import { useTRPC } from '@/integrations/trpc/react'
import { CategoryData } from '@/types/data'

interface ActionBarProps {
  table: Table<CategoryData>
}

function CategoriesActionBar({ table }: ActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const searchParams = useSearch({ from: '/_admin/dashboard/categories' })

  const categoriesKey = trpc.categories.transaction.queryKey(searchParams)
  const deleteMutation = useMutation(trpc.categories.delete.mutationOptions())

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table],
  )

  const onDelete = React.useCallback(() => {
    const ids = rows.map((row) => row.original.id)

    toast.promise(deleteMutation.mutateAsync({ ids }), {
      loading: `Deleting ${ids.length} categories...`,
      success: (response) => {
        queryClient.invalidateQueries({
          queryKey: categoriesKey,
        })
        return response?.message || 'Categories deleted successfully'
      },
      error: (error) => {
        return error?.message || 'Something went wrong'
      },
    })
  }, [rows, table])

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        <span className="font-medium">{rows.length}</span>
        <span>selected</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <X />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <ActionBarItem variant="destructive" onClick={onDelete}>
          <Trash2 />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  )
}

export default CategoriesActionBar
