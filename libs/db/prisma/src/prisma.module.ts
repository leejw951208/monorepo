import { customPrismaClient } from '@libs/db/prisma/config/custom-prisma-client'
import { PrismaLifecycle } from '@libs/db/prisma/config/prisma-life-cycle'
import { PRISMA } from '@libs/db/prisma/config/prisma-token'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ClsService } from 'nestjs-cls'
import { Logger } from 'winston'

@Module({
    providers: [
        {
            provide: PRISMA,
            inject: [ConfigService, ClsService, WINSTON_MODULE_NEST_PROVIDER],
            useFactory: (config: ConfigService, cls: ClsService, logger: Logger) => customPrismaClient(config, cls, logger)
        },
        PrismaLifecycle
    ],
    exports: [PRISMA]
})
export class PrismaModule {}
