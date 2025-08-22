import { PRISMA } from '@libs/db/prisma/config/prisma-token'
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaLifecycle implements OnModuleInit, OnModuleDestroy {
    constructor(@Inject(PRISMA) private readonly prisma: PrismaService) {}

    async onModuleInit() {
        await this.prisma.$connect()
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect()
    }
}
