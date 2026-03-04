import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createStandardSchemaV1 } from 'nuqs'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCoursesTableColumns } from '@/features/courses/components/courses-table-columns'
import { useDataTable } from '@/hooks/use-data-table'
import { coursesSearchParams } from '@/schema/search'

export const Route = createFileRoute('/_admin/dashboard/courses/{-$id}')({
  validateSearch: createStandardSchemaV1(coursesSearchParams, {
    partialOutput: true,
  }),
  loader: async ({ params, context: { queryClient, trpc } }) => {
    let course = null
    if (params.id) {
      course = await queryClient.ensureQueryData(
        trpc.courses.getById.queryOptions({ id: params.id }),
      )
    }

    return { course }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  if (id) {
    return <CourseContainer id={id} />
  }

  return <CoursesTable />
}

function CoursesTable() {
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

function CourseContainer({ id }: { id: string }) {
  const { trpc } = Route.useRouteContext()

  const { data, isLoading } = useQuery(
    trpc.courses.getById.queryOptions({ id }),
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Course not found</div>
  }

  return (
    <div>
      <Tabs defaultValue="category">
        <TabsList>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="category">
          <h1>{data.name}</h1>
          <p>{data.description}</p>
          <p>Created At: {new Date(data.createdAt).toLocaleDateString()}</p>
        </TabsContent>
        <TabsContent value="topics">
          <h2>Topics</h2>
          {/* <ul>
            {data.topics.map((topic) => (
              <li key={topic.id}>
                {topic.name} - {topic.isActive ? 'Active' : 'Inactive'}
              </li>
            ))}
          </ul> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
