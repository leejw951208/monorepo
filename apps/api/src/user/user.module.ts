import { UserRepository } from '@libs/models/user/user.repository'
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserRepository]
})
export class UserModule {}
