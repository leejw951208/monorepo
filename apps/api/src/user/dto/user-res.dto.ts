import { ApiProperty } from '@nestjs/swagger'
import { UserStatus } from '@prisma/client'
import { Expose } from 'class-transformer'

export class UserResDto {
    @ApiProperty({ type: Number, required: true, description: '유저 아이디', example: 1 })
    @Expose()
    id: number

    @ApiProperty({ type: String, required: true, description: '유저 이메일', example: 'test@test.com' })
    @Expose()
    email: string

    @ApiProperty({ type: String, required: true, description: '유저 이름', example: '홍길동' })
    @Expose()
    name: string

    @ApiProperty({ type: String, required: true, description: '유저 상태', example: 'ACTIVE' })
    @Expose()
    status: UserStatus

    @ApiProperty({ type: Date, required: true, description: '유저 생성일', example: '2021-01-01' })
    @Expose()
    createdAt: Date

    @ApiProperty({ type: Date, required: true, description: '유저 수정일', example: '2021-01-01' })
    @Expose()
    updatedAt: Date
}
