import { BaseModel } from '@libs/models/base/base.model'
import { JwtToken, JwtType, Site } from '@prisma/client'

type CreateInput = Partial<JwtToken> & {
    userId?: number | null
    adminId?: number | null
    refreshToken: string
    site: Site
    jwtType: JwtType
}

export class JwtTokenModel extends BaseModel implements JwtToken {
    userId: number | null
    adminId: number | null
    refreshToken: string
    site: Site
    jwtType: JwtType

    private constructor(userId: number | null, adminId: number | null, refreshToken: string, site: Site, jwtType: JwtType) {
        super()
        this.userId = userId
        this.adminId = adminId
        this.refreshToken = refreshToken
        this.site = site
        this.jwtType = jwtType
    }

    static create(input: CreateInput): JwtTokenModel {
        return new JwtTokenModel(input.userId ?? null, input.adminId ?? null, input.refreshToken, input.site, input.jwtType)
    }
}
