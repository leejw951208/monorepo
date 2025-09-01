import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { UserResDto } from '../../user/dto/user-res.dto'

export class SigninResponseDto {
    @ApiProperty({ type: String, required: true, description: '액세스 토큰', example: 'access-token' })
    @Expose()
    accessToken: string

    @ApiProperty({ type: UserResDto, required: true, description: '회원 정보', example: UserResDto })
    @Expose()
    user: UserResDto
}
