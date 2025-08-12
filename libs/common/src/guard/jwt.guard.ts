import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JsonWebTokenError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '../decorator/public.decorator'
import { BaseException } from '../exception/base.exception'
import { AUTH_ERROR } from '../exception/error.code'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // @Public() 데코레이터가 있는지 확인하고 있으면 검증 예외
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
        if (isPublic) {
            return true
        }

        // JWT Strategy로 토큰 검증을 위임
        return super.canActivate(context)
    }

    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (info) {
            if (info instanceof JsonWebTokenError) {
                throw new BaseException(AUTH_ERROR.INVALID_ACCESS_TOKEN, this.constructor.name)
            } else {
                throw new BaseException(AUTH_ERROR.MISSING_ACCESS_TOKEN, this.constructor.name)
            }
        }
        return super.handleRequest(err, user, info, context, status)
    }
}
