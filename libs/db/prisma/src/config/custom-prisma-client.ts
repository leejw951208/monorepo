import { createExtension, filterSoftDeletedExtension, softDeleteExtension, updateExtension } from '@libs/db/prisma/config/prisma-extenstion'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { ClsService } from 'nestjs-cls'
import { Logger } from 'winston'

export const customPrismaClient = (config: ConfigService, cls: ClsService, logger: Logger) => {
    const client = new PrismaClient({
        datasources: { db: { url: config.get<string>('DATABASE_URL')! } },
        log: [{ emit: 'event', level: 'query' }]
    })

    client.$on('query' as never, ({ query, params }) => {
        logger.debug(`${query}: ${params}`)
    })

    return client
        .$extends(filterSoftDeletedExtension)
        .$extends(createExtension(cls))
        .$extends(updateExtension(cls))
        .$extends(softDeleteExtension(cls))
}
