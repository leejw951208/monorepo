import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'apps/api/src/user/user.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaModule } from '@libs/db/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [],
        }),
        PrismaModule,
        UserModule,
    ],
    controllers: [ApiController],
    providers: [ApiService],
})
export class ApiModule {}
