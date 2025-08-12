import { ApiProperty } from '@nestjs/swagger'

export class PageableResponseDto {
    @ApiProperty({ type: Number, description: '조회하는 페이지', example: '3' })
    page: number

    @ApiProperty({ type: Number, description: '페이지수 당 데이터 수', example: '10' })
    size: number

    @ApiProperty({ type: Number, description: '전체 데이터 수', example: '101' })
    totalCount: number

    @ApiProperty({ type: Number, description: '마지막 페이지', example: '17' })
    maxPage: number

    constructor(page: number, size: number, totalCount: number) {
        this.page = page
        this.size = size
        this.totalCount = totalCount
        this.maxPage = Math.ceil(totalCount / size)
    }
}
