import { BaseException } from '@libs/common/exception/base.exception'
import { AUTH_ERROR } from '@libs/common/exception/error.code'
import { UserModel } from '@libs/models/user/user.model'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

interface TokenPayload {
    userId: number
    type: string
    key: string
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

    async createAccessToken(user: UserModel): Promise<string> {
        const payload = this.createTokenPayload(user, 'ac')
        return await this.signToken(payload, this.accessTokenExpiresIn)
    }

    async createRefreshToken(user: UserModel): Promise<string> {
        const payload = this.createTokenPayload(user, 're')
        return await this.signToken(payload, this.refreshTokenExpiresIn)
    }

    createTokenPayload(user: UserModel, type: 'ac' | 're'): TokenPayload {
        return {
            userId: user.id,
            type,
            key: 'nsp'
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
