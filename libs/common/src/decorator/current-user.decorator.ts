import { UserModel } from '@libs/models/user/user.model'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 현재 인증된 사용자 정보를 컨트롤러 파라미터로 주입하는 커스텀 데코레이터
 *
 * 동작 방식:
 * 1. HTTP 요청이 들어오면 Guard(AuthGuard)에서 사용자 인증을 처리
 * 2. 인증 성공시 request.user에 UserModel 객체가 저장됨
 * 3. @CurrentUser() 데코레이터가 붙은 파라미터에서 request.user를 추출해서 주입
 *
 * 사용 예시:
 * @Post('signin')
 * async signin(@CurrentUser() user: UserModel): Promise<SigninResponseDto> {
 *     // user 파라미터에 인증된 사용자 정보가 자동으로 주입됨
 * }
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
})
