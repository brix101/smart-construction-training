import { createTRPCContext } from '@trpc/tanstack-react-query'

import type { AppRouter } from '@/server/trpc/router/_app'

export const { TRPCProvider, useTRPCClient, useTRPC } =
  createTRPCContext<AppRouter>()
