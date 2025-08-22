import { BaseModel } from '@libs/models/base/base.model'
import { Token } from '@prisma/client'

export class TokenModel extends BaseModel implements Token {
    userId: number
    refreshToken: string

    private constructor(userId: number, refreshToken: string) {
        super()
        this.userId = userId
        this.refreshToken = refreshToken
    }

    static create(input: Pick<Token, 'userId' | 'refreshToken'>): TokenModel {
        return new TokenModel(input.userId, input.refreshToken)
    }
}
