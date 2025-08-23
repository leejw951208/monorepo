import type { customPrismaClient } from '@libs/db/prisma/config/custom-prisma-client'
import type { PrismaClient } from '@prisma/client'

declare global {
    // PrismaClient 교차 타입으로 기본 delegate 네비게이션을 보장
    type PrismaService = PrismaClient & Awaited<ReturnType<typeof customPrismaClient>>
}
export {}
