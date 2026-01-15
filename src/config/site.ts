import type { DashboardConfig, MainNavItem } from '@/types'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Smart Construction Training',
  description:
    'A comprehensive collection of courses designed to provide training in various aspects.',
  mainNav: [
    {
      title: 'Lobby',
      items: [
        {
          title: 'Courses',
          href: '/',
          description: 'All the courses currently available.',
          items: [],
        },
      ],
    },
  ] satisfies MainNavItem[],
}

export const dashboardConfig: DashboardConfig = {
  navItems: [
    {
      title: 'Courses',
      href: '/dashboard/courses',
      icon: 'courses',
      items: [],
    },
    {
      title: 'Categories',
      href: '/dashboard/categories',
      icon: 'categories',
      items: [],
    },
    {
      title: 'Users',
      href: '/dashboard/users',
      icon: 'users',
      items: [],
    },
  ],
}
