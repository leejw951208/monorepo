import { BaseModel } from '@libs/models/base/base.model'
import { User, UserStatus } from '@prisma/client'

export class UserModel extends BaseModel implements User {
    name: string
    email: string
    password: string
    status: UserStatus

    private constructor(email: string, password: string, name: string, status: UserStatus) {
        super()
        this.email = email
        this.password = password
        this.name = name
        this.status = status
    }

    static create(input: Pick<User, 'email' | 'password' | 'name' | 'status'>): UserModel {
        return new UserModel(input.email, input.password, input.name, input.status)
    }
}
