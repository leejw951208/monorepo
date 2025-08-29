import { ApiController } from '@apps/api/api.controller'
import { ApiService } from '@apps/api/api.service'
import { AuthModule } from '@apps/api/auth/auth.module'
import { UserModule } from '@apps/api/user/user.module'
import { winstonModuleAsyncOptions } from '@libs/common/config/winston.config'
import { JwtAccessGuard } from '@libs/common/guard/jwt-access.guard'
import { CustomClsMiddleware } from '@libs/common/middleware/cls.middleware'
import { LoggerMiddleware } from '@libs/common/middleware/logger.middleware'
import { PrismaModule } from '@libs/prisma/prisma.module'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { WinstonModule } from 'nest-winston'
import { ClsModule } from 'nestjs-cls'
import * as path from 'path'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                path.resolve(process.cwd(), `./envs/.env.${process.env.NODE_ENV}`), // 공통
                path.resolve(process.cwd(), `./apps/api/envs/.env.${process.env.NODE_ENV}`) // 앱 전용
            ],
            load: []
        }),
        ClsModule.forRoot({
            global: true,
            middleware: { mount: false }
        }),
        WinstonModule.forRootAsync(winstonModuleAsyncOptions),
        PrismaModule,
        AuthModule,
        UserModule
    ],
    controllers: [ApiController],
    providers: [ApiService, { provide: APP_GUARD, useClass: JwtAccessGuard }]
})
export class ApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: '*splat', method: RequestMethod.ALL })
            .apply(CustomClsMiddleware)
            .forRoutes({ path: '*splat', method: RequestMethod.ALL })
    }
}
