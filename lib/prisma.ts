import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

// Check if DATABASE_URL is available during build
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  throw new Error(
    'DATABASE_URL environment variable is required for production builds'
  )
}

const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
