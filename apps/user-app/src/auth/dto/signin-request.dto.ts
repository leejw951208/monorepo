import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SigninRequestDto {
    @ApiProperty({ type: String, required: true, description: '로그인 아이디', example: 'testuser' })
    @IsNotEmpty({ message: '로그인 아이디는 필수입니다.' })
    @IsString({ message: '로그인 아이디는 문자열입니다.' })
    loginId: string

    @ApiProperty({ type: String, required: true, description: '비밀번호', example: 'user1234!@' })
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    @IsString({ message: '비밀번호는 문자열입니다.' })
    password: string
}
