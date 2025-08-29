import { UserResDto } from '@apps/api/user/dto/user-res.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class SigninResponseDto {
    @ApiProperty({ type: String, required: true, description: '액세스 토큰', example: 'access-token' })
    @Expose()
    accessToken: string

    @ApiProperty({ type: UserResDto, required: true, description: '회원 정보', example: UserResDto })
    @Expose()
    user: UserResDto
}
