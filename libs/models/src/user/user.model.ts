import { BaseModel } from '@libs/models/base/base.model'
import { User, UserStatus } from '@prisma/client'

export class UserModel extends BaseModel implements User {
    loginId: string
    password: string
    email: string
    name: string
    phone: string
    status: UserStatus

    private constructor(loginId: string, password: string, email: string, name: string, phone: string, status: UserStatus) {
        super()
        this.loginId = loginId
        this.password = password
        this.email = email
        this.name = name
        this.phone = phone
        this.status = status
    }

    static create(input: Pick<User, 'loginId' | 'password' | 'email' | 'name' | 'phone' | 'status'>): UserModel {
        return new UserModel(input.loginId, input.password, input.email, input.name, input.phone, input.status)
    }
}
