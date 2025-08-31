import { TokenPayload } from '@libs/common/utils/jwt.util'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const JwtPayload = createParamDecorator((data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
})
