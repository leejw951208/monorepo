import { createExtension, findExtension, softDeleteExtension, updateExtension } from '@libs/prisma/prisma-extension'
import { ConfigService } from '@nestjs/config'
import { Prisma, PrismaClient } from '@prisma/client'
import { ClsService } from 'nestjs-cls'
import { Logger } from 'winston'

export const customPrismaClient = (config: ConfigService, cls: ClsService, logger: Logger) => {
    const client = new PrismaClient({
        datasources: { db: { url: config.get<string>('DATABASE_URL')! } },
        log: [{ emit: 'event', level: 'query' }]
    })

    client.$on('query', (e: Prisma.QueryEvent) => {
        logger.debug(`${e.query}: ${e.params}`)
    })

    return client.$extends(findExtension).$extends(createExtension(cls)).$extends(updateExtension(cls)).$extends(softDeleteExtension(cls))
}
