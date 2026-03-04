import { Link } from '@tanstack/react-router'
import { CalendarIcon, Ellipsis, TextIcon } from 'lucide-react'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/format'
import { getRandomPatternStyle } from '@/lib/generate-pattern'
import { RouterOutput } from '@/server/trpc/router/_app'

type ColumnType = RouterOutput['courses']['list']['items'][0]

interface GetCoursesTableColumnsProps {}

export function getCoursesTableColumns({}: GetCoursesTableColumnsProps): ColumnDef<ColumnType>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      size: 40,
    },
    {
      accessorKey: 'pattern',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Pattern" />
      ),
      cell: ({ row }) => {
        return (
          <Card className="size-10 cursor-pointer overflow-hidden p-0 hover:opacity-80">
            <AspectRatio ratio={4 / 4}>
              <div
                className="h-full rounded-t-md border-b object-center"
                style={getRandomPatternStyle(row.original.id)}
              />
            </AspectRatio>
          </Card>
        )
      },
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      id: 'query',
      accessorKey: 'query',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row: { original } }) => (
        <Button variant="link" className="p-0">
          <Link to="/dashboard/courses/{-$id}" params={{ id: original.id }}>
            {original.name}
          </Link>
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: true,
      size: 200,
      meta: {
        label: 'Name',
        placeholder: 'Search categories...',
        variant: 'text',
        icon: TextIcon,
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Description" />
      ),
      cell: ({ row }) => {
        const original = row.original
        return <span>{original.description}</span>
      },
      meta: {
        label: 'Description',
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'topicCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Topic Count" />
      ),
      cell: ({ row }) => {
        const original = row.original
        return <span>{original.topicCount}</span>
      },
      meta: {
        label: 'Topic Count',
      },
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: 'Created At',
        variant: 'date',
        icon: CalendarIcon,
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        // const setRowAction = useCategoryRowAction((state) => state.setRowAction)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard/courses/{-$id}"
                  params={{ id: row.original.id }}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
              // onSelect={() =>
              //   setRowAction({ rows: [row], variant: 'delete' })
              // }
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}
