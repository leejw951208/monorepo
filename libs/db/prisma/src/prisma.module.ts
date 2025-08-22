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
            inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER, ClsService],
            useFactory: (config: ConfigService, logger: Logger, cls: ClsService) => customPrismaClient(config, logger, cls)
        },
        PrismaLifecycle
    ],
    exports: [PRISMA]
})
export class PrismaModule {}
