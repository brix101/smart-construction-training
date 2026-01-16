import { CalendarIcon, Ellipsis, TextIcon } from 'lucide-react'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate, formatSignInDate } from '@/lib/format'

import { User } from '../types'

export const usersTableColumns: ColumnDef<User>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-0.5"
  //     />
  //   ),

  //   enableSorting: false,
  //   enableHiding: false,
  //   size: 40,
  // },
  {
    id: 'query',
    accessorKey: 'query',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="User" />
    ),
    cell: ({ row: { original } }) => {
      const emails = original.emailAddresses
      const email =
        emails.find((e) => e.id === original.primaryEmailAddressId)
          ?.emailAddress ?? ''
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={original.imageUrl} alt={''} />
            <AvatarFallback>{email.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p>{`${original.firstName ?? ''} ${original.lastName ?? ''}`}</p>
            <ul className="text-muted-foreground">
              {emails.map((email) => {
                return <li key={email.id}>{email.emailAddress}</li>
              })}
            </ul>
          </div>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: true,
    meta: {
      label: 'User',
      placeholder: 'Search user...',
      variant: 'text',
      icon: TextIcon,
    },
  },
  {
    accessorKey: 'lastSignInAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Last Signed In" />
    ),
    cell: ({ row }) => {
      const original = row.original
      const lastSignInAt = original.lastSignInAt
      const formattedDate = formatSignInDate(lastSignInAt)
      return <span>{formattedDate}</span>
    },
    meta: {
      label: 'Last Signed In',
    },
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
      variant: 'dateRange',
      icon: CalendarIcon,
    },
    enableColumnFilter: false,
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
              <Ellipsis className="size-4" />
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
