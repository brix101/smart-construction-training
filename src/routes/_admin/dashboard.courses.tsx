import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { getCoursesTableColumns } from '@/features/courses/components/courses-table-columns'
import { useDataTable } from '@/hooks/use-data-table'
import { coursesSearchParams } from '@/schema/search'

export const Route = createFileRoute('/_admin/dashboard/courses')({
  validateSearch: createStandardSchemaV1(coursesSearchParams, {
    partialOutput: true,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const search = Route.useSearch()

  const { data, isLoading } = useQuery(trpc.courses.list.queryOptions(search))

  const columns = React.useMemo(() => getCoursesTableColumns({}), [])

  const { table } = useDataTable({
    data: data?.items || [],
    columns: columns,
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
        // actionBar={<CategoriesActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          {/* <CategoriesCreateSheet /> */}
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
