import { PrismaClient } from '@prismaatt'

const globalForPrisma = global as unknown as {
    attprisma: PrismaClient | undefined
}

export const attprisma = globalForPrisma.attprisma ??
    new PrismaClient({
        log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.attprisma = attprisma