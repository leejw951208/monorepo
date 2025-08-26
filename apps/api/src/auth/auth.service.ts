import { SigninRequestDto } from '@apps/api/auth/dto/signin-request.dto'
import { SigninResponseDto } from '@apps/api/auth/dto/signin-response.dto'
import { SignupRequestDto } from '@apps/api/auth/dto/signup-request.dto'
import { BaseException } from '@libs/common/exception/base.exception'
import { AUTH_ERROR, USER_ERROR } from '@libs/common/exception/error.code'
import { findAsync } from '@libs/common/utils/async.util'
import { BcryptUtil } from '@libs/common/utils/bcrypt.util'
import { JwtUtil } from '@libs/common/utils/jwt.util'
import { TokenJwtModel } from '@libs/models/token/token-jwt.model'
import { TokenModel } from '@libs/models/token/token.model'
import { UserModel } from '@libs/models/user/user.model'
import { PrismaService } from '@libs/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Owner, TokenType, UserStatus } from '@prisma/client'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
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
        await this.prisma.client.user.create({ data: createdUser })
    }

    async signin(reqDto: SigninRequestDto): Promise<SigninResponseDto> {
        const foundUser = await this.prisma.client.user.findUnique({ where: { email: reqDto.email } })
        if (!foundUser) {
            throw new BaseException(USER_ERROR.NOT_FOUND, this.constructor.name)
        }

        const isMatched = await this.bcryptUtil.compare(reqDto.password, foundUser.password)
        if (!isMatched) {
            throw new BaseException(AUTH_ERROR.PASSWORD_NOT_MATCHED, this.constructor.name)
        }

        const accessToken = await this.jwtUtil.createAccessToken(foundUser, 'api')
        const refreshToken = await this.jwtUtil.createRefreshToken(foundUser, 'api')

        const createdToken = TokenModel.create({
            tokenHash: await this.bcryptUtil.hash(refreshToken),
            tokenType: TokenType.JWT,
            owner: Owner.USER,
            ownerId: foundUser.id
        })

        // await this.prisma.client.token.create({
        //     data: { ...createdToken, tokenJwt: { create: {} } }
        // })

        return plainToInstance(SigninResponseDto, {
            accessToken,
            refreshToken
        })
    }

    async signout(refreshToken: string): Promise<void> {
        // 토큰 검증 및 페이로드 추출
        const payload = await this.jwtUtil.verify(refreshToken, 're')
        await this.prisma.client.tokenJwt.softDelete({ where: { id: payload.pk } })
    }

    async refreshToken(refreshToken: string): Promise<SigninResponseDto> {
        // 토큰 검증 및 페이로드 추출
        const payload = await this.jwtUtil.verify(refreshToken, 're')

        // 사용자 정보 조회
        const foundUser = await this.prisma.client.user.findUnique({ where: { id: payload.pk } })
        if (!foundUser) throw new BaseException(USER_ERROR.NOT_FOUND, this.constructor.name)

        // DB에서 리프레시 토큰 조회
        const foundTokens = await this.prisma.client.token.findMany({
            where: { owner: Owner.USER, ownerId: foundUser.id, tokenType: TokenType.JWT }
        })

        const foundToken = await findAsync(foundTokens, (token) => {
            return this.bcryptUtil.compare(refreshToken, token.tokenHash)
        })
        if (!foundToken) throw new BaseException(AUTH_ERROR.INVALID_REFRESH_TOKEN, this.constructor.name)

        // 새로운 토큰 생성
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtUtil.createAccessToken(foundUser, 'api'),
            this.jwtUtil.createRefreshToken(foundUser, 'api')
        ])

        // 토큰 갱신
        await this.prisma.client.token.delete({ where: { id: foundToken.id } })
        await this.prisma.client.token.create({
            data: {
                tokenHash: await this.bcryptUtil.hash(newRefreshToken),
                tokenType: TokenType.JWT,
                owner: Owner.USER,
                ownerId: foundUser.id,
                tokenJwt: {
                    create: {
                        tokenId: foundToken.id,
                        refreshToken: newRefreshToken
                    }
                }
            }
        })

        return plainToInstance(SigninResponseDto, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    }
}
