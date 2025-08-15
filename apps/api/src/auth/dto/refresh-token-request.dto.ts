import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenRequestDto {
    @ApiProperty({ type: String, required: true, description: '리프레시 토큰', example: 'refresh-token' })
    @IsNotEmpty({ message: '리프레시 토큰은 필수입니다.' })
    @IsString({ message: '리프레시 토큰은 문자열입니다.' })
    refreshToken: string
}
