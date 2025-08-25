import { RoleCreateDto } from '@apps/admin/system/role/dto/role-create.dto'
import { PrismaService } from '@libs/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RoleService {
    constructor(private readonly prisma: PrismaService) {}

    async create(reqDto: RoleCreateDto): Promise<void> {}
}
