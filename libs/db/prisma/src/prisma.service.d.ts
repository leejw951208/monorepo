declare global {
    type PrismaService = Awaited<ReturnType<typeof import('@libs/db/prisma/config/custom-prisma-client').customPrismaClient>>
}
export {}
