import { SignOutButton } from '@clerk/nextjs'
import { DashboardIcon, ExitIcon, GearIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import type { ButtonProps } from '@/components/ui/button'
import type { User } from '@clerk/nextjs/server'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, getUserEmail } from '@/lib/utils'

interface AuthDropdownProps extends ButtonProps {
  user: User | null
  isAdmin?: boolean
}

export function AuthDropdown({
  user,
  isAdmin,
  className,
  ...props
}: AuthDropdownProps) {
  if (!user) {
    return (
      <Link
        href="/sign-in"
        className={buttonVariants({
          size: 'sm',
        })}
      >
        Sign In
        <span className="sr-only">Sign In</span>
      </Link>
    )
  }

  const email = getUserEmail(user)
  const initials = `${email.charAt(0) ?? ''}`.toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn('h-8 w-8 rounded-full', className)}
          {...props}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.username ?? ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAdmin ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/courses">
                  <DashboardIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  Dashboard
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/users">
                  <Icons.users className="mr-2 h-4 w-4" aria-hidden="true" />
                  Users
                  <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </>
          ) : undefined}
          <DropdownMenuItem asChild>
            <Link href="/dashboard/account">
              <GearIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton redirectUrl="/sign-in">
            <div>
              <ExitIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
