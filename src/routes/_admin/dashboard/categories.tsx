import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import CategoriesActionBar from '@/features/categories/components/categories-action-bar'
import CategoriesDeleteDialog from '@/features/categories/components/categories-delete-dialog'
import { getCategoriesTableColumns } from '@/features/categories/components/categories-table-columns'
import { useDataTable } from '@/hooks/use-data-table'
import { categoriesSearchParams } from '@/schema/search'
import { CategoryData } from '@/types/data'
import { DataTableRowAction } from '@/types/data-table'

export const Route = createFileRoute('/_admin/dashboard/categories')({
  validateSearch: createStandardSchemaV1(categoriesSearchParams, {
    partialOutput: true,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const search = Route.useSearch()

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<CategoryData> | null>(null)

  const { data, isLoading } = useQuery(
    trpc.categories.transaction.queryOptions({
      ...search,
      sort: search.sort ?? [{ id: 'name', desc: false }],
    }),
  )

  const columns = React.useMemo(
    () =>
      getCategoriesTableColumns({
        setRowAction,
      }),
    [],
  )

  const { table } = useDataTable({
    data: data?.items || [],
    columns: columns,
    pageCount: data?.pageCount || 1,
    initialState: {
      sorting: search.sort ?? [{ id: 'name', desc: false }],
    },
    getRowId: (originalRow) => originalRow.id,
    clearOnDefault: true,
  })

  if (isLoading) {
    return (
      <div className="mt-4">
        <DataTableSkeleton
          columnCount={columns.length}
          filterCount={1}
          shrinkZero
        />
      </div>
    )
  }

  return (
    <div className="mt-4">
      <DataTable
        table={table}
        actionBar={<CategoriesActionBar table={table} />}
      >
        <DataTableToolbar table={table}></DataTableToolbar>
      </DataTable>
      <CategoriesDeleteDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        items={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </div>
  )
}
