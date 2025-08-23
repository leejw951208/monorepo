import { PRISMA } from '@libs/db/prisma/config/prisma-token'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
    constructor(
        @Inject(PRISMA)
        private readonly prisma: PrismaService
    ) {}

    async findUser(id: number): Promise<void> {
        const user = await this.prisma.user.findFirst({ where: { id } })
        console.log(user)
    }

    async delete(id: number): Promise<void> {
        await this.prisma.user.softDelete({ where: { id } })
    }
}
