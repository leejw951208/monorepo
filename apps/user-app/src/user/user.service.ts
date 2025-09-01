import { CursorPageResDto, OffsetPageResDto } from '@libs/common/dto/page-res.dto'
import { BaseException } from '@libs/common/exception/base.exception'
import { USER_ERROR } from '@libs/common/exception/error.code'
import { TokenPayload } from '@libs/common/utils/jwt.util'
import { PrismaService } from '@libs/prisma/prisma.service'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { user } from '@prisma/client/sql'
import { plainToInstance } from 'class-transformer'
import { UserResDto } from './dto/user-res.dto'
import { UserUpdateDto } from './dto/user-update.dto'
import { UserCursorPageReqDto, UserOffsetPageReqDto } from './dto/user-page-req.dto'
import { listUsersCursor, listUsersOffset } from './query/user.query'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    async findMe(payload: TokenPayload): Promise<UserResDto> {
        const foundUser = await this.prisma.client.user.findFirst({ where: { id: payload.id } })
        return plainToInstance(UserResDto, foundUser, { excludeExtraneousValues: true })
    }

    async updateMe(payload: TokenPayload, reqDto: UserUpdateDto): Promise<void> {
        const updatedUser = await this.prisma.client.user.update({ where: { id: payload.id }, data: reqDto })
        if (!updatedUser) throw new BaseException(USER_ERROR.NOT_FOUND, this.constructor.name)
    }

    async findUsersWithOffset(searchCondition: UserOffsetPageReqDto): Promise<OffsetPageResDto<UserResDto>> {
        const { items, totalCount } = await listUsersOffset(this.prisma, searchCondition)
        return new OffsetPageResDto(plainToInstance(UserResDto, items, { excludeExtraneousValues: true }), searchCondition.page, totalCount)
    }

    async findUsersWithCursor(searchCondition: UserCursorPageReqDto): Promise<CursorPageResDto<UserResDto>> {
        const { items, nextId } = await listUsersCursor(this.prisma, searchCondition)
        return new CursorPageResDto(plainToInstance(UserResDto, items, { excludeExtraneousValues: true }), nextId)
    }

    async typedSql() {
        const test = await this.prisma.client.$queryRawTyped(user())
        console.log(test)
    }
}
