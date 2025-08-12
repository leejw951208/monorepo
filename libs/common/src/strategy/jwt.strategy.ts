import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { BaseException } from '../exception/base.exception'
import { AUTH_ERROR } from '../exception/error.code'

interface JwtPayload {
    userId: number
    type: string
    key: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY')
        })
    }

    async validate(payload: JwtPayload) {
        if (payload.type !== 'ac' || payload.key !== 'nsp') {
            throw new BaseException(AUTH_ERROR.INVALID_ACCESS_TOKEN, this.constructor.name)
        }
        return { userId: payload.userId }
    }
}
