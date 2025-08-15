import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, PrismaClient } from '@prisma/client'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class DbService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        private readonly configService: ConfigService
    ) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL')!
                }
            },
            log: [
                {
                    emit: 'event',
                    level: 'query'
                }
            ]
        })
        this.$on('query', ({ query, params }) => {
            this.logger.debug(`${query}: ${params}`)
        })
    }

    async onModuleInit() {
        await this.$connect()
    }
}
