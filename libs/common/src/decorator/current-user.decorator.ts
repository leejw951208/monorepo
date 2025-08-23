import { UserModel } from '@libs/models/user/user.model'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
})
