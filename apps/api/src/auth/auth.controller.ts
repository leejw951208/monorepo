import { Public } from '@libs/common/decorator/public.decorator'
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { SignupRequestDto } from './dto/signup-request.dto'
import { SigninRequestDto } from '@libs/auth/dto/signin-request.dto'
import { SigninResponseDto } from '@libs/auth/dto/signin-response.dto'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@libs/common/decorator/user.decorator'
import { UserModel } from '@libs/models/user/user.model'
import { RefreshTokenRequestDto } from '@libs/auth/dto/refresh-token-request.dto'

const path = 'auth'
@ApiTags(path)
@ApiBearerAuth('JWT-Auth')
@Controller({ path })
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @ApiOperation({ summary: '회원가입' })
    @ApiBody({ type: SignupRequestDto })
    @ApiResponse({ status: HttpStatus.CREATED })
    @Public()
    @Post('signup')
    async signup(@Body() reqDto: SignupRequestDto): Promise<void> {
        return this.service.signup(reqDto)
    }

    @ApiOperation({ summary: '로그인' })
    @ApiBody({ type: SigninRequestDto })
    @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDto })
    @UseGuards(AuthGuard('local'))
    @Public()
    @Post('signin')
    async signin(@CurrentUser() user: UserModel): Promise<SigninResponseDto> {
        return this.service.signin(user)
    }

    @ApiOperation({ summary: '로그아웃' })
    @ApiBody({ type: RefreshTokenRequestDto })
    @ApiResponse({ status: HttpStatus.OK })
    @UseGuards(AuthGuard('jwt'))
    @Post('signout')
    async signout(@Body() reqDto: RefreshTokenRequestDto): Promise<void> {
        return this.service.signout(reqDto.refreshToken)
    }

    @ApiOperation({ summary: '토큰 재발급' })
    @ApiBody({ type: RefreshTokenRequestDto })
    @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDto })
    @Public()
    @Post('token/refresh')
    async refreshToken(@Body() reqDto: RefreshTokenRequestDto): Promise<SigninResponseDto> {
        return await this.service.refreshToken(reqDto.refreshToken)
    }
}
