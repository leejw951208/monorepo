import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { DbService } from './db.service'
import { ClsService } from 'nestjs-cls'
import { create, filterSoftDeleted, softDelete, update } from '@libs/db/db.extenstion'

export const PRISMA_SERVICE = 'PrismaService'

@Global()
@Module({
    providers: [
        {
            provide: PRISMA_SERVICE,
            inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER, ClsService],
            useFactory: (configService: ConfigService, logger: Logger, clsService: ClsService) => {
                return new DbService(logger, configService, clsService)
            }
        }
    ],
    exports: [PRISMA_SERVICE]
})
export class DbModule {}
