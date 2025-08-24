import { customPrismaClient } from '@libs/db/prisma/prisma.client'
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ClsService } from 'nestjs-cls'
import { Logger } from 'winston'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    public readonly client: ReturnType<typeof customPrismaClient> & PrismaClient

    constructor(config: ConfigService, cls: ClsService, @Inject(WINSTON_MODULE_NEST_PROVIDER) logger: Logger) {
        this.client = customPrismaClient(config, cls, logger) as unknown as ReturnType<typeof customPrismaClient> & PrismaClient
    }

    // 앱 부팅 후 바로 DB에 연결하여 첫 쿼리 요청 시 연결이 늦어지는 문제 방지하기 위해 선언
    async onModuleInit() {
        await this.client.$connect()
    }

    // 앱 종료 시 남아있는 커넥션 풀, 잔여 연결을 종료하기 위해 선언
    async onModuleDestroy() {
        await this.client.$disconnect()
    }
}
