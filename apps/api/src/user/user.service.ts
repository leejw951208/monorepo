import { UserCursorPageReqDto, UserOffsetPageReqDto } from '@apps/api/user/dto/user-page-req.dto'
import { UserResDto } from '@apps/api/user/dto/user-res.dto'
import { UserUpdateDto } from '@apps/api/user/dto/user-update.dto'
import { listUsersCursor, listUsersOffset } from '@apps/api/user/query/user.query'
import { CursorPageResDto, OffsetPageResDto } from '@libs/common/dto/page-res.dto'
import { BaseException } from '@libs/common/exception/base.exception'
import { USER_ERROR } from '@libs/common/exception/error.code'
import { TokenPayload } from '@libs/common/utils/jwt.util'
import { PrismaService } from '@libs/prisma/prisma.service'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { user } from '@prisma/client/sql'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    async findMe(payload: TokenPayload): Promise<UserResDto> {
        const foundUser = await this.prisma.client.user.findFirst({ where: { id: payload.id } })
        const cacheUser = await this.cacheManager.get('user')
        if (!cacheUser) {
            await this.cacheManager.set('user', foundUser, 30 * 1000)
        }
        console.log(cacheUser)
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
