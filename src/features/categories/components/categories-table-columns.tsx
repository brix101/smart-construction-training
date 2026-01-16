import { Ellipsis, TextIcon } from 'lucide-react'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getRandomPatternStyle } from '@/lib/generate-pattern'
import { CategoryData } from '@/types/data'

export const categoriesTableColumns: ColumnDef<CategoryData>[] = [
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
    accessorKey: 'imgSrc',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Image" />
    ),
    cell: ({ row }) => {
      const imgSrc = row.original.imgSrc
      const name = row.original.name
      return (
        <div className="h-16 w-16 overflow-hidden rounded-sm border">
          <AspectRatio ratio={4 / 4}>
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={name}
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                loading="lazy"
              />
            ) : (
              <div
                className="h-full rounded-t-md border-b object-center"
                style={getRandomPatternStyle(row.original.id)}
              />
            )}
          </AspectRatio>
        </div>
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
    cell: ({ row: { original } }) => {
      const name = original.name

      return <p>{name}</p>
    },
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
    accessorKey: 'courseCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Course Count" />
    ),
    cell: ({ row }) => {
      const original = row.original
      return <span>{original.courseCount}</span>
    },
    meta: {
      label: 'Course Count',
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: function Cell() {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="data-[state=open]:bg-muted flex size-8 p-0"
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
            // onSelect={() => setRowAction({ row, variant: "update" })}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            // onSelect={() => setRowAction({ row, variant: "delete" })}
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
