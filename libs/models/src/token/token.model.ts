import { BaseModel } from '@libs/models/base/base.model'
import { Owner, Token, TokenType } from '@prisma/client'

type CreateInput = Partial<Token> & {
    tokenHash: string
    tokenType: TokenType
    owner: Owner
    ownerId: number
}

export class TokenModel extends BaseModel implements Token {
    tokenHash: string
    tokenType: TokenType
    owner: Owner
    ownerId: number

    private constructor(tokenHash: string, tokenType: TokenType, owner: Owner, ownerId: number) {
        super()
        this.tokenHash = tokenHash
        this.tokenType = tokenType
        this.owner = owner
        this.ownerId = ownerId
    }

    static create(input: CreateInput): TokenModel {
        return new TokenModel(input.tokenHash, input.tokenType, input.owner, input.ownerId)
    }
}
