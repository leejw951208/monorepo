import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { BaseException } from '../exception/base.exception'
import { AUTH_ERROR, SERVER_ERROR } from '../exception/error.code'

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt') {
    handleRequest(err: any, payload: any, info: any) {
        if (err) throw new BaseException(SERVER_ERROR.GENERAL, this.constructor.name)

        const name = info?.name as string | undefined
        if (name === 'TokenExpiredError') throw new BaseException(AUTH_ERROR.EXPIRED_REFRESH_TOKEN, this.constructor.name)
        if (name === 'JsonWebTokenError' || name === 'NotBeforeError')
            throw new BaseException(AUTH_ERROR.INVALID_REFRESH_TOKEN, this.constructor.name)

        if (!payload) throw new BaseException(AUTH_ERROR.MISSING_REFRESH_TOKEN, this.constructor.name)
        if (payload.type !== 're') throw new BaseException(AUTH_ERROR.INVALID_REFRESH_TOKEN, this.constructor.name)

        return payload
    }
}
