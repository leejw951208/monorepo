import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class UserUpdateDto {
    @ApiProperty({ required: true, description: '회원 이메일', example: 'testuser@user.com' })
    @IsNotEmpty({ message: '이메일은 필수입니다.' })
    @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
    email: string
}
