import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Min } from 'class-validator'

export class PageableRequestDto {
    @ApiProperty({ type: Number, name: 'page', required: true, description: '조회하는 페이지', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number

    @ApiProperty({ type: Number, name: 'size', required: true, description: '페이지 당 데이터 수', example: 5 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    size: number

    @ApiProperty({
        type: String,
        name: 'order',
        required: false,
        description: '정렬 방식(asc | desc), 기본: desc',
        example: 'desc',
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order: 'asc' | 'desc'
}
