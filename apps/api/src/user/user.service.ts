import { PRISMA_SERVICE } from '@libs/db/prisma.module';
import { PrismaService } from '@libs/db/prisma.service';
import { UserModel } from '@libs/models/user/user.model';
import { Inject, Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject(PRISMA_SERVICE)
        private readonly prisma: PrismaService,
    ) {}

    async createUser() {
        const user = UserModel.create({
            email: 'test@test.com',
            password: await bcrypt.hash('1234', 10),
            name: 'test',
            status: UserStatus.ACTIVATED,
        });
        return this.prisma.user.create({
            data: user,
        });
    }
}
