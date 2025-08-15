import { ApiProperty } from '@nestjs/swagger'

export class SigninResponseDto {
    @ApiProperty({ type: String, description: '액세스 토큰', example: 'access-token' })
    accessToken: string

    @ApiProperty({ type: String, description: '리프레시 토큰', example: 'refresh-token' })
    refreshToken: string
}
