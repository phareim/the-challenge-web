import { NuxtAuthHandler } from '#auth'
import GoogleProvider from '@auth/core/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma),
  secret: useRuntimeConfig().auth.secret,
  providers: [
    GoogleProvider({
      clientId: useRuntimeConfig().google.clientId,
      clientSecret: useRuntimeConfig().google.clientSecret
    })
  ],
  pages: {
    signIn: '/login'
  }
}) 