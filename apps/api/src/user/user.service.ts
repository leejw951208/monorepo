import { UserCursorPageReqDto, UserOffsetPageReqDto } from '@apps/api/user/dto/user-page-req.dto'
import { UserResDto } from '@apps/api/user/dto/user-res.dto'
import { listUsersCursor, listUsersOffset } from '@apps/api/user/query/user.query'
import { CursorPageResDto, OffsetPageResDto } from '@libs/common/dto/page-res.dto'
import { PrismaService } from '@libs/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findUsersWithOffset(searchCondition: UserOffsetPageReqDto): Promise<OffsetPageResDto<UserResDto>> {
        const { items, totalCount } = await listUsersOffset(this.prisma, searchCondition)
        return new OffsetPageResDto(plainToInstance(UserResDto, items, { excludeExtraneousValues: true }), searchCondition.page, totalCount)
    }

    async findUsersWithCursor(searchCondition: UserCursorPageReqDto): Promise<CursorPageResDto<UserResDto>> {
        const { items, nextId } = await listUsersCursor(this.prisma, searchCondition)
        return new CursorPageResDto(plainToInstance(UserResDto, items, { excludeExtraneousValues: true }), nextId)
    }
}
