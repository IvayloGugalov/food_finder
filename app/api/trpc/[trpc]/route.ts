import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import type { NextRequest } from 'next/server'
import { appRouter } from '@/lib/server/routers/_app'
import { createTRPCContext } from '@/lib/trpc/context'
import { env } from '@/lib/env.mjs'

const createContext = async (request: NextRequest) => {
  return createTRPCContext({
    headers: request.headers,
  })
}

const handler = (request: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => createContext(request),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
          }
        : undefined,
  })

export { handler as GET, handler as POST }
