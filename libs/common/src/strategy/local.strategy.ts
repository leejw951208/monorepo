import { AuthService } from '@libs/auth/auth.service'
import { UserModel } from '@libs/models/user/user.model'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

/**
 * Local 인증 전략 - passport-local을 사용한 이메일/비밀번호 기반 인증
 *
 * 동작 과정:
 * 1. 클라이언트가 POST /auth/signin 엔드포인트로 이메일/비밀번호 전송
 * 2. LocalGuard(@UseGuards(AuthGuard('local')))가 이 전략을 실행
 * 3. passport-local이 request body에서 usernameField('email')와 passwordField('password') 추출
 * 4. 추출된 값들을 validate() 메서드에 자동으로 전달
 * 5. validate()에서 AuthService.validate()를 호출하여 사용자 인증
 * 6. 인증 성공시 사용자 정보를 반환, 실패시 예외 발생
 *
 * super() 호출 이유:
 * - passport-local의 기본 필드명은 'username', 'password'
 * - 로그인 시 'email', 'password'를 사용하므로 usernameField를 'email'로 오버라이드
 * - 이 설정으로 passport가 req.body.email과 req.body.password를 자동 추출
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email', passwordField: 'password' })
    }
    async validate(email: string, password: string): Promise<Omit<UserModel, 'password'>> {
        return await this.authService.validate(email, password)
    }
}
