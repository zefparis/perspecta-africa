import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL
  
  if (!url) {
    console.warn('DATABASE_URL is not defined in environment variables')
  }

  return new PrismaClient({
    // @ts-ignore - datasources is valid at runtime but types might be strict due to schema config
    datasources: {
      db: {
        url: url || '', // Prevent crash on empty string, though connection will fail if used
      },
    },
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prisma ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
