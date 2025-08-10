import { PrismaCommon } from '@libs/db/prisma.common';
import { User, UserStatus } from '@prisma/client';
import { UserSaveDto } from 'apps/api/src/user/dto/user-save.dto';

export class UserModel extends PrismaCommon implements User {
    name: string;
    email: string;
    password: string;
    status: UserStatus;

    private constructor(email: string, password: string, name: string, status: UserStatus) {
        super();
        this.email = email;
        this.password = password;
        this.name = name;
        this.status = status;
        this.createdBy = 1;
        this.createdAt = new Date();
    }

    static create(dto: UserSaveDto): UserModel {
        return new UserModel(dto.email, dto.password, dto.name, dto.status);
    }
}
