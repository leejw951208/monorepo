import { UserStatus } from '@prisma/client';

export class UserSaveDto {
    email: string;
    password: string;
    name: string;
    status: UserStatus;
}
