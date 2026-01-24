import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { usersTableColumns } from '@/features/users/components/users-table-columns'
import { useDataTable } from '@/hooks/use-data-table'
import { usersSearchParams } from '@/schema/search'

export const Route = createFileRoute('/_admin/dashboard/users')({
  validateSearch: createStandardSchemaV1(usersSearchParams, {
    partialOutput: true,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const search = Route.useSearch()

  const { data, isLoading } = useQuery(trpc.users.list.queryOptions(search))

  const { table } = useDataTable({
    data: data?.items || [],
    columns: usersTableColumns,
    pageCount: data?.pageCount || 1,
    initialState: {
      sorting: search.sort,
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    clearOnDefault: true,
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={usersTableColumns.length}
        filterCount={1}
        // cellWidths={['25rem', '15rem', '15rem', '5rem']}
        shrinkZero
      />
    )
  }

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}></DataTableToolbar>
      </DataTable>
    </>
  )
}
