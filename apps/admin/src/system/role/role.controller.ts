import { Body, Controller, Post } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleCreateDto } from '@apps/admin/system/role/dto/role-create.dto'

@Controller('role')
export class RoleController {
    constructor(private readonly service: RoleService) {}

    @Post()
    async create(@Body() reqDto: RoleCreateDto): Promise<void> {
        return this.service.create(reqDto)
    }
}
