import { BaseModel } from '@libs/models/base/base.model'
import { TokenJwt } from '@prisma/client'

export class TokenJwtModel extends BaseModel implements TokenJwt {
    tokenId: number

    private constructor(tokenId: number) {
        super()
        this.tokenId = tokenId
    }

    static create(tokenId: number): TokenJwtModel {
        return new TokenJwtModel(tokenId)
    }
}
