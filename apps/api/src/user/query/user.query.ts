import { UserModel } from '@libs/models/user/user.model'
import { PrismaService } from '@libs/prisma/prisma.service'
import { UserCursorPageReqDto, UserOffsetPageReqDto } from '../dto/user-page-req.dto'

export type UserOffsetResult = {
    items: UserModel[]
    totalCount: number
}

export type UserCursorResult = {
    items: UserModel[]
    nextId: number | null
}

export const listUsersOffset = async (prisma: PrismaService, searchCondition: UserOffsetPageReqDto): Promise<UserOffsetResult> => {
    const { page, size, order = 'desc' } = searchCondition

    // 필요한 동적 where를 여기에 합쳐 넣으면 됨
    const where = {}

    const items = await prisma.client.user.findMany({
        where,
        orderBy: { id: order },
        skip: (page - 1) * size,
        take: size
    })

    const totalCount = await prisma.client.user.count({ where })

    return { items, totalCount }
}

export const listUsersCursor = async (prisma: PrismaService, searchCondition: UserCursorPageReqDto): Promise<UserCursorResult> => {
    const { nextId, size, order = 'desc' } = searchCondition

    const take = Math.max(1, Math.min(size, 100))
    const op = order === 'desc' ? 'lt' : 'gt' // 핵심: 비교 연산자 선택

    // 필요한 동적 where를 여기에 합쳐 넣으면 됨
    const where = {
        ...(nextId ? { id: { [op]: nextId } } : {})
        // ...추가 필터
    }

    const users = await prisma.client.user.findMany({
        where,
        orderBy: { id: order },
        take: take + 1
    })

    const hasMore = users.length > take
    const items = hasMore ? users.slice(0, take) : users
    const nextCursor = hasMore ? items[items.length - 1]!.id : null

    return { items, nextId: nextCursor }
}
