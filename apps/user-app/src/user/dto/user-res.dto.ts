import { ApiProperty } from '@nestjs/swagger'
import { UserStatus } from '@prisma/client'
import { Expose } from 'class-transformer'

export class UserResDto {
    @ApiProperty({ required: true, description: '회원 아이디', example: 1 })
    @Expose()
    id: number

    @ApiProperty({ required: true, description: '회원 이메일', example: 'test@test.com' })
    @Expose()
    email: string

    @ApiProperty({ required: true, description: '회원 이름', example: '홍길동' })
    @Expose()
    name: string

    @ApiProperty({ required: true, description: '회원 상태', example: 'ACTIVE' })
    @Expose()
    status: UserStatus

    @ApiProperty({ required: true, description: '회원 생성일', example: '2021-01-01' })
    @Expose()
    createdAt: Date

    @ApiProperty({ required: true, description: '회원 수정일', example: '2021-01-01' })
    @Expose()
    updatedAt: Date
}
