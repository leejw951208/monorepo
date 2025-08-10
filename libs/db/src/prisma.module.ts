import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

export const PRISMA_SERVICE = 'PRISMA_SERVICE';

@Global()
@Module({
    providers: [
        {
            provide: PRISMA_SERVICE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new PrismaService(configService);
            },
        },
    ],
    exports: [PRISMA_SERVICE],
})
export class PrismaModule {}
