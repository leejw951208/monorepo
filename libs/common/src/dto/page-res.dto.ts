import { ApiProperty } from '@nestjs/swagger'

export class OffsetPageResDto<T> {
    @ApiProperty({ type: [Object], required: true, description: '데이터 목록' })
    data: T[]

    @ApiProperty({ type: Number, required: false, description: '다음 페이지 아이디(PK)', example: '5' })
    page: number

    @ApiProperty({ type: Number, required: true, description: '전체 데이터 수', example: '101' })
    totalCount: number

    constructor(data: T[], page: number, totalCount: number) {
        this.data = data
        this.page = page
        this.totalCount = totalCount
    }
}

export class CursorPageResDto<T> {
    @ApiProperty({ type: [Object], required: true, description: '데이터 목록' })
    data: T[]

    @ApiProperty({ type: Number, required: false, description: '다음 페이지 아이디(PK)', example: '5' })
    nextId: number | null

    constructor(data: T[], nextId: number | null) {
        this.data = data
        this.nextId = nextId
    }
}
