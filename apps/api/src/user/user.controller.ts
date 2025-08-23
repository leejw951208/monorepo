import { Controller, Delete, Get, Param } from '@nestjs/common'
import { ParseIntPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { Public } from '@libs/common/decorator/public.decorator'
import { UserModel } from '@libs/models/user/user.model'

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Public()
    @Get(':id')
    async findUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        this.service.findUser(id)
    }

    @Public()
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.delete(id)
    }
}
