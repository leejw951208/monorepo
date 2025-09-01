import { TokenPayload } from '@libs/common/utils/jwt.util'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Cache } from 'cache-manager'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { BaseException } from '../exception/base.exception'
import { AUTH_ERROR } from '../exception/error.code'
import { BcryptUtil } from '../utils/bcrypt.util'

/**
 * JWT 인증 전략 - passport-jwt를 사용한 JWT 토큰 기반 인증
 *
 * 동작 과정:
 * 1. 클라이언트가 Authorization: Bearer <token> 헤더로 JWT 토큰 전송
 * 2. JwtGuard(@UseGuards(JwtGuard))가 이 전략을 실행
 * 3. passport-jwt가 ExtractJwt.fromAuthHeaderAsBearerToken()로 토큰 추출
 * 4. JWT_SECRET_KEY로 토큰 검증 (서명, 만료시간)
 * 5. 토큰이 유효하면 페이로드를 validate() 메서드에 전달
 * 6. validate()에서 추가 검증 수행 (토큰 타입, 키 검증)
 * 7. 검증 성공시 회원 PK 반환, 실패시 예외 발생
 *
 * super() 호출 이유:
 * - jwtFromRequest: Bearer 토큰에서 JWT 추출 방식 설정
 * - ignoreExpiration: false로 설정하여 만료된 토큰 거부
 * - secretOrKey: 토큰 서명 검증에 사용할 비밀키 설정
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly configService: ConfigService,
        private readonly bcryptUtil: BcryptUtil
    ) {
        super({
            // 먼저 헤더를 조회하고 없으면 쿠키를 조회한다.
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(), // 앱
                (req: Request) => req?.cookies?.refreshToken // 웹
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY')!,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: TokenPayload) {
        // 토큰 발급자 검증
        if (payload.issuer !== 'monorepo' || !payload.jti) throw new BaseException(AUTH_ERROR.INVALID_ACCESS_TOKEN, this.constructor.name)

        // 헤더 또는 쿠키에서 리프레시 토큰 추출
        const foundToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? (req?.cookies?.refreshToken as string)
        if (!foundToken) throw new BaseException(AUTH_ERROR.MISSING_REFRESH_TOKEN, this.constructor.name)

        // Redis에 저장된 리프레시 토큰 조회
        const cachedToken = await this.cacheManager.get<string>(`rt:${payload.jti}`)
        if (!cachedToken) throw new BaseException(AUTH_ERROR.MISSING_REFRESH_TOKEN, this.constructor.name)

        // 리프레시 토큰 비교
        const isMatched = await this.bcryptUtil.compare(foundToken, cachedToken)
        if (!isMatched) throw new BaseException(AUTH_ERROR.INVALID_REFRESH_TOKEN, this.constructor.name)

        return payload
    }
}
