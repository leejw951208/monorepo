import { winstonModuleAsyncOptions } from '@libs/common/config/winston.config'
import { CustomClsMiddleware } from '@libs/common/middleware/cls.middleware'
import { LoggerMiddleware } from '@libs/common/middleware/logger.middleware'
import { PrismaModule } from '@libs/prisma/prisma.module'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { ClsModule } from 'nestjs-cls'
import * as path from 'path'
import { AdminAppController } from './admin-app.controller'
import { AdminAppService } from './admin-app.service'
import { RoleModule } from './system/role/role.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                path.resolve(process.cwd(), `./envs/.env.${process.env.NODE_ENV}`), // 공통
                path.resolve(process.cwd(), `./apps/admin-app/envs/.env.${process.env.NODE_ENV}`) // 앱 전용
            ],
            load: []
        }),
        ClsModule.forRoot({
            global: true,
            middleware: { mount: false }
        }),
        WinstonModule.forRootAsync(winstonModuleAsyncOptions),
        PrismaModule,
        RoleModule
    ],
    controllers: [AdminAppController],
    providers: [AdminAppService]
})
export class AdminAppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: '*splat', method: RequestMethod.ALL })
            .apply(CustomClsMiddleware)
            .forRoutes({ path: '*splat', method: RequestMethod.ALL })
    }
}
