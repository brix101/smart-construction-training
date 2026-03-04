import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

// Import the generated route tree
import { queryClient, trpcClient, TRPCProvider } from '@/lib/trpc'
import AppClerkProvider from '@/providers/clerk-provider'

import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })

  const router = createRouter({
    routeTree,
    context: {
      trpc: serverHelpers,
      queryClient: queryClient,
    },
    defaultPreload: 'intent',
    Wrap: function WrapComponent({ children }) {
      return (
        <AppClerkProvider>
          <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
              {children}
            </TRPCProvider>
          </QueryClientProvider>
        </AppClerkProvider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
