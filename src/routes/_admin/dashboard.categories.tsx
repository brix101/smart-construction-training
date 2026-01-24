import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import CategoriesActionBar from '@/features/categories/components/categories-action-bar'
import { CategoriesCreateSheet } from '@/features/categories/components/categories-create-sheet'
import CategoriesDeleteDialog from '@/features/categories/components/categories-delete-dialog'
import { getCategoriesTableColumns } from '@/features/categories/components/categories-table-columns'
import { CategoriesUpdateSheet } from '@/features/categories/components/categories-update-sheet'
import { useDataTable } from '@/hooks/use-data-table'
import { categoriesSearchParams } from '@/schema/search'

export const Route = createFileRoute('/_admin/dashboard/categories')({
  validateSearch: createStandardSchemaV1(categoriesSearchParams, {
    partialOutput: true,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const search = Route.useSearch()

  const { data, isLoading } = useQuery(
    trpc.categories.list.queryOptions({
      ...search,
      sort: search.sort ?? [{ id: 'name', desc: false }],
    }),
  )

  const columns = React.useMemo(() => getCategoriesTableColumns({}), [])

  const { table } = useDataTable({
    data: data?.items || [],
    columns: columns,
    pageCount: data?.pageCount || 1,
    initialState: {
      sorting: search.sort ?? [{ id: 'name', desc: false }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    clearOnDefault: true,
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        filterCount={1}
        shrinkZero
      />
    )
  }

  return (
    <>
      <DataTable
        table={table}
        actionBar={<CategoriesActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          <CategoriesCreateSheet />
        </DataTableToolbar>
      </DataTable>
      <CategoriesUpdateSheet />
      <CategoriesDeleteDialog showTrigger={false} />
    </>
  )
}
