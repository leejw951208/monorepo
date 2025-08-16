import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as path from 'path'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                path.resolve(process.cwd(), `./envs/.env.${process.env.NODE_ENV}`), // 공통
                path.resolve(process.cwd(), `./apps/admin/envs/.env.${process.env.NODE_ENV}`) // 앱 전용
            ],
            load: []
        })
    ],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule {}
