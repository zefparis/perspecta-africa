import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Allow self-signed certificates for Supabase in development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  
  const pool = new Pool({ 
    connectionString,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false }
  })
  
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prisma ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
