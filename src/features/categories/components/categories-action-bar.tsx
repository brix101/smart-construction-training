import React from 'react'
import { SquarePen, Trash2, X } from 'lucide-react'

import type { Table } from '@tanstack/react-table'
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from '@/components/ui/action-bar'
import { CategoryData } from '@/types/data'

import { useCategoryRowAction } from '../state'

interface ActionBarProps {
  table: Table<CategoryData>
}

function CategoriesActionBar({ table }: ActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const { setRowAction } = useCategoryRowAction()

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table],
  )

  const onEdit = React.useCallback(() => {
    const row = rows[0]
    if (!row) return
    setRowAction({
      variant: 'update',
      rows: [row],
    })
  }, [rows, table])

  const onDelete = React.useCallback(() => {
    setRowAction({
      variant: 'delete',
      rows: rows,
    })
  }, [rows, table])

  return (
    <>
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
          <ActionBarItem disabled={rows.length > 1} onClick={onEdit}>
            <SquarePen />
            Edit
          </ActionBarItem>
          <ActionBarItem variant="destructive" onClick={onDelete}>
            <Trash2 />
            Delete
          </ActionBarItem>
        </ActionBarGroup>
      </ActionBar>
    </>
  )
}

export default CategoriesActionBar
