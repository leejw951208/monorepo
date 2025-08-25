import { Site } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class RoleCreateDto {
    @ApiProperty({ type: String, required: true, description: '역할명', example: 'ADMIN' })
    name: string

    @ApiProperty({ type: String, required: true, enum: Site, description: '사이트', example: 'USER' })
    site: Site

    @ApiProperty({ type: String, description: '설명', example: '관리자 역할' })
    description?: string
}
