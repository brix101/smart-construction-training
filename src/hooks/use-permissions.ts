import { useUser } from '@clerk/clerk-react'

export function usePermissions() {
  const { user } = useUser()

  const orgs = user?.organizationMemberships || []
  const permissions = orgs.flatMap((org) => org.permissions)

  const has = (permission: string) => {
    return permissions.includes(permission)
  }

  return { has }
}
