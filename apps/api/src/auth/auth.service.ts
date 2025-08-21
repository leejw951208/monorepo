import { SigninResponseDto } from '@apps/api/auth/dto/signin-response.dto'
import { SignupRequestDto } from '@apps/api/auth/dto/signup-request.dto'
import { BaseException } from '@libs/common/exception/base.exception'
import { AUTH_ERROR, USER_ERROR } from '@libs/common/exception/error.code'
import { BcryptUtil } from '@libs/common/utils/bcrypt.util'
import { JwtUtil } from '@libs/common/utils/jwt.util'
import { DbService } from '@libs/db/db.service'
import { TokenModel } from '@libs/models/token/token.model'
import { TokenRepository } from '@libs/models/token/token.repository'
import { UserModel } from '@libs/models/user/user.model'
import { UserRepository } from '@libs/models/user/user.repository'
import { Injectable } from '@nestjs/common'
import { UserStatus } from '@prisma/client'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenRepository: TokenRepository,
        private readonly bcryptUtil: BcryptUtil,
        private readonly jwtUtil: JwtUtil
    ) {}

    async signup(reqDto: SignupRequestDto): Promise<void> {
        const hashedPassword = await this.bcryptUtil.hash(reqDto.password)
        const createdUser = UserModel.create({
            email: reqDto.email,
            password: hashedPassword,
            name: reqDto.name,
            status: UserStatus.ACTIVE
        })
        await this.userRepository.insert(createdUser)
    }

    async validate(email: string, password: string): Promise<UserModel> {
        const foundUser = await this.userRepository.findOne({ email })
        if (!foundUser) {
            throw new BaseException(USER_ERROR.NOT_FOUND, this.constructor.name)
        }
        const isMatched = await this.bcryptUtil.compare(password, foundUser.password)
        if (!isMatched) {
            throw new BaseException(AUTH_ERROR.PASSWORD_NOT_MATCHED, this.constructor.name)
        }
        return foundUser
    }

    async signin(user: UserModel): Promise<SigninResponseDto> {
        const accessToken = await this.jwtUtil.createAccessToken(user)
        const refreshToken = await this.jwtUtil.createRefreshToken(user)

        const createdToken = TokenModel.create({ userId: user.id, refreshToken })
        await this.tokenRepository.insert(createdToken)

        return plainToInstance(SigninResponseDto, {
            accessToken,
            refreshToken
        })
    }

    async signout(refreshToken: string): Promise<void> {
        // 토큰 검증 및 페이로드 추출
        const payload = await this.jwtUtil.verify(refreshToken, 're')
        await this.tokenRepository.deleteMany({ userId: payload.userId, refreshToken })
    }

    async refreshToken(refreshToken: string): Promise<SigninResponseDto> {
        // 토큰 검증 및 페이로드 추출
        const payload = await this.jwtUtil.verify(refreshToken, 're')

        // 사용자 정보 조회
        const foundUser = await this.userRepository.findOne({ id: payload.userId })
        if (!foundUser) throw new BaseException(USER_ERROR.NOT_FOUND, this.constructor.name)

        // DB에서 리프레시 토큰 조회
        const foundToken = await this.tokenRepository.findOne({ userId: foundUser.id, refreshToken })
        if (!foundToken) throw new BaseException(AUTH_ERROR.INVALID_REFRESH_TOKEN, this.constructor.name)

        // 새로운 토큰 생성
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtUtil.createAccessToken(foundUser),
            this.jwtUtil.createRefreshToken(foundUser)
        ])

        // 토큰 갱신
        await this.tokenRepository.update(foundToken.id, { refreshToken: newRefreshToken })

        return plainToInstance(SigninResponseDto, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    }
}
