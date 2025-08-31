import { BaseException } from '@libs/common/exception/base.exception'
import { AUTH_ERROR } from '@libs/common/exception/error.code'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Admin, User } from '@prisma/client'

type Aud = 'admin' | 'api'

export type TokenPayload = {
    id?: number // pk
    type?: 'ac' | 're' // 토큰 타입
    aud?: Aud // 토큰 수신자
    jti?: string // 토큰 고유 값
    issuer?: string // 토큰 발급자
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

    async createAccessToken(model: User | Admin, aud: Aud, jti: string): Promise<string> {
        const payload = this.createTokenPayload(model, aud, 'ac', jti)
        return await this.signToken(payload, this.accessTokenExpiresIn)
    }

    async createRefreshToken(model: User | Admin, aud: Aud, jti: string): Promise<string> {
        const payload = this.createTokenPayload(model, aud, 're', jti)
        return await this.signToken(payload, this.refreshTokenExpiresIn)
    }

    createTokenPayload(model: User | Admin, aud: Aud, type: 'ac' | 're', jti: string): TokenPayload {
        return {
            id: model.id,
            type,
            aud,
            jti,
            issuer: 'monorepo'
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

        if (payload.type !== type || payload.issuer !== 'monorepo') {
            throw new BaseException(AUTH_ERROR.INVALID_REFRESH_TOKEN, this.constructor.name)
        }

        return payload
    }
}
