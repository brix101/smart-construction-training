import type { Icons } from '@/components/icons'

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: Array<NavItemWithChildren>
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: Array<NavItemWithChildren>
}

export interface FooterItem {
  title: string
  items: Array<{
    title: string
    href: string
    external?: boolean
  }>
}

export type MainNavItem = NavItemWithOptionalChildren

export type DashboardConfig = {
  navItems: Array<NavItemWithChildren>
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<
  TData,
> extends DataTableSearchableColumn<TData> {
  options: Array<Option>
}

export type FileWithPreview = File & {
  preview: string
}

export interface SearchParams {
  [key: string]: string | Array<string> | undefined
}
