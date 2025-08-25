import { UserStatus } from '@prisma/client'

export class UserCreateDto {
    email: string
    password: string
    name: string
    status: UserStatus
}
