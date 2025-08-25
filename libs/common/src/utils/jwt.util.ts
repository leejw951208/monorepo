import { BaseException } from '@libs/common/exception/base.exception'
import { AUTH_ERROR } from '@libs/common/exception/error.code'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Admin, User } from '@prisma/client'

type Aud = 'admin' | 'api'

export type TokenPayload = {
    pk?: number
    type?: string
    aud?: Aud
}

@Injectable()
export class JwtUtil {
    private readonly accessTokenExpiresIn: string
    private readonly refreshTokenExpiresIn: string
    private readonly jwtSecretKey: string

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        this.accessTokenExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '1h'
        this.refreshTokenExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d'
        this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY')!
    }

    async createAccessToken(model: User | Admin, aud: Aud): Promise<string> {
        const payload = this.createTokenPayload(model, aud, 'ac')
        return await this.signToken(payload, this.accessTokenExpiresIn)
    }

    async createRefreshToken(model: User | Admin, aud: Aud): Promise<string> {
        const payload = this.createTokenPayload(model, aud, 're')
        return await this.signToken(payload, this.refreshTokenExpiresIn)
    }

    createTokenPayload(model: User | Admin, aud: Aud, type: 'ac' | 're'): TokenPayload {
        return {
            pk: model.id,
            type,
            aud
        } as TokenPayload
    }

    async signToken(payload: TokenPayload, expiresIn: string): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            secret: this.jwtSecretKey,
            expiresIn
        })
    }

    async verify(token: string, type: 'ac' | 're'): Promise<TokenPayload> {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.jwtSecretKey
        })

        if (payload.type !== type) {
            throw new BaseException(AUTH_ERROR.INVALID_REFRESH_TOKEN, this.constructor.name)
        }

        return payload
    }
}
