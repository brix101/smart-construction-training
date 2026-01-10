import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import type { AppRouter } from '@/server/trpc/router/_app'
import type { QueryClient } from '@tanstack/react-query'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { ThemeProvider } from '@/components/theme-provider'
import ClerkProvider from '@/integrations/clerk/provider'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Smart Contruction Training',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <ClerkProvider>
            {children}
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </ClerkProvider>
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  )
}
