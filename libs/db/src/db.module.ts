import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { DbService } from './db.service'

export const PRISMA_SERVICE = 'PrismaService'

@Global()
@Module({
    providers: [
        {
            provide: PRISMA_SERVICE,
            inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
            useFactory: (configService: ConfigService, logger: Logger) => {
                return new DbService(logger, configService)
            }
        }
    ],
    exports: [PRISMA_SERVICE]
})
export class DbModule {}
