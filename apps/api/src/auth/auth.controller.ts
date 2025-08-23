import { Public } from '@libs/common/decorator/public.decorator'
import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto'
import { SigninRequestDto } from './dto/signin-request.dto'
import { SigninResponseDto } from './dto/signin-response.dto'
import { SignupRequestDto } from './dto/signup-request.dto'

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
    @Public()
    @Post('signin')
    async signin(@Body() reqDto: SigninRequestDto): Promise<SigninResponseDto> {
        return this.service.signin(reqDto)
    }

    @ApiOperation({ summary: '로그아웃' })
    @ApiBody({ type: RefreshTokenRequestDto })
    @ApiResponse({ status: HttpStatus.OK })
    @Post('signout')
    async signout(@Body() reqDto: RefreshTokenRequestDto): Promise<void> {
        return this.service.signout(reqDto.refreshToken)
    }

    @ApiOperation({ summary: '토큰 재발급' })
    @ApiBody({ type: RefreshTokenRequestDto })
    @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDto })
    @Post('token/refresh')
    async refreshToken(@Body() reqDto: RefreshTokenRequestDto): Promise<SigninResponseDto> {
        return await this.service.refreshToken(reqDto.refreshToken)
    }
}
