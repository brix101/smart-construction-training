import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchStreamLink, loggerLink } from '@trpc/client'
import { createTRPCContext, createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import superjson from 'superjson'

import type { AppRouter } from '@/server/trpc/router/_app'


function getUrl() {
    const base = (() => {
        if (typeof window !== 'undefined') return ''
        return `http://localhost:${process.env.PORT ?? 3000}`
    })()
    return `${base}/api/trpc`
}

export const trpcClient = createTRPCClient<AppRouter>({
    links: [
        loggerLink({
            enabled: (opts) =>
                (process.env.NODE_ENV === 'development' &&
                    typeof window !== 'undefined') ||
                (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchStreamLink({
            transformer: superjson,
            url: getUrl(),
        }),
    ],
})

export const queryClient = new QueryClient({
    defaultOptions: {
        dehydrate: { serializeData: superjson.serialize },
        hydrate: { deserializeData: superjson.deserialize },
    },
})

export function getContext() {
    const queryClient = new QueryClient({
        defaultOptions: {
            dehydrate: { serializeData: superjson.serialize },
            hydrate: { deserializeData: superjson.deserialize },
        },
    })

    const serverHelpers = createTRPCOptionsProxy({
        client: trpcClient,
        queryClient: queryClient,
    })
    return {
        queryClient,
        trpc: serverHelpers,
    }
}

export const { TRPCProvider, useTRPCClient, useTRPC } =
    createTRPCContext<AppRouter>()
