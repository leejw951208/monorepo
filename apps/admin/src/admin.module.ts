import { AdminController } from '@apps/admin/admin.controller'
import { AdminService } from '@apps/admin/admin.service'
import { RoleModule } from '@apps/admin/system/role/role.module'
import { winstonModuleAsyncOptions } from '@libs/common/config/winston.config'
import { CustomClsMiddleware } from '@libs/common/middleware/cls.middleware'
import { LoggerMiddleware } from '@libs/common/middleware/logger.middleware'
import { PrismaModule } from '@libs/prisma/prisma.module'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { ClsModule } from 'nestjs-cls'
import * as path from 'path'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                path.resolve(process.cwd(), `./envs/.env.${process.env.NODE_ENV}`), // 공통
                path.resolve(process.cwd(), `./apps/admin/envs/.env.${process.env.NODE_ENV}`) // 앱 전용
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
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: '*splat', method: RequestMethod.ALL })
            .apply(CustomClsMiddleware)
            .forRoutes({ path: '*splat', method: RequestMethod.ALL })
    }
}
