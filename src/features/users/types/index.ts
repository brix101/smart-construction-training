import { User as ClerkUser } from '@clerk/backend'

export type User = Pick<
  ClerkUser,
  | 'id'
  | 'emailAddresses'
  | 'imageUrl'
  | 'lastSignInAt'
  | 'firstName'
  | 'lastName'
  | 'publicMetadata'
  | 'primaryEmailAddressId'
  | 'createdAt'
  | 'updatedAt'
>
