import { db } from '@/lib/db/index'
import { getUserAuth } from '@/lib/auth/utils'

export async function createTRPCContext(options: { headers: Headers }) {
  const { session } = await getUserAuth()

  return {
    db,
    session: session,
    ...options,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
