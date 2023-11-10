import { PrismaClient as PisPrismaClient } from '@prismapis'

const globalForPisPrisma = global as unknown as {
    pisprisma: PisPrismaClient | undefined
}

export const pisprisma = globalForPisPrisma.pisprisma ??
    new PisPrismaClient({
        log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPisPrisma.pisprisma = pisprisma