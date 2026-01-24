import { createFileRoute } from '@tanstack/react-router'
import { createRouteHandler } from 'uploadthing/server'

import { uploadRouter } from '@/server/common/uploadthing'

const handlers = createRouteHandler({ router: uploadRouter })

export const Route = createFileRoute('/api/uploadthing/$')({
  server: {
    handlers: {
      POST: ({ request }) => handlers(request),
      GET: ({ request }) => handlers(request),
    },
  },
})
