import { createTRPCContext } from '@trpc/tanstack-react-query'

import type { AppRouter } from '@/server/routes'

export const { TRPCProvider, useTRPCClient, useTRPC } =
  createTRPCContext<AppRouter>()
