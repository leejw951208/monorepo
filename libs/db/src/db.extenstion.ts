import { Prisma } from '@prisma/client'
import { ClsService } from 'nestjs-cls'

const findOperations = ['findFirst', 'findFirstOrThrow', 'findMany', 'count'] as const
type FindOperation = (typeof findOperations)[number]

export const filterSoftDeleted = Prisma.defineExtension({
    name: 'filterSoftDeleted',
    query: {
        $allModels: {
            async $allOperations({ operation, args, query }) {
                // 커스텀 옵션으로 soft delete 필터링 무시
                if ((args as any).withDeleted) {
                    delete (args as any).withDeleted
                    return query(args)
                }
                if (findOperations.includes(operation as FindOperation)) {
                    // args에 where가 없거나 falsy
                    if (!('where' in args) || !args.where) {
                        ;(args as any).where = { isDeleted: false }
                    } else {
                        ;(args as any).where = {
                            AND: [args.where, { isDeleted: false }]
                        }
                    }
                }
                return query(args)
            }
        }
    }
})

export const create = (clsService: ClsService) =>
    Prisma.defineExtension({
        name: 'create',
        query: {
            $allModels: {
                async create({ args, query }) {
                    args.data = { ...args.data, createdBy: clsService.get('userId') }
                    return query(args)
                },
                async createMany({ args, query }) {
                    args.data = Array.isArray(args.data)
                        ? args.data.map((data) => ({ ...data, createdBy: clsService.get('userId') }))
                        : { ...args.data, createdBy: clsService.get('userId') }
                    return query(args)
                }
            }
        }
    })

export const update = (clsService: ClsService) =>
    Prisma.defineExtension({
        name: 'update',
        query: {
            $allModels: {
                async update({ args, query }) {
                    args.data = { ...args.data, updatedBy: clsService.get('userId'), updatedAt: new Date() }
                    return query(args)
                },
                async updateMany({ args, query }) {
                    args.data = Array.isArray(args.data)
                        ? args.data.map((data) => ({
                              ...data,
                              updatedBy: clsService.get('userId'),
                              updatedAt: new Date()
                          }))
                        : { ...args.data, updatedBy: clsService.get('userId'), updatedAt: new Date() }
                    return query(args)
                }
            }
        }
    })

// delete 쿼리를 update 쿼리로 변경
export const softDelete = (clsService: ClsService) =>
    Prisma.defineExtension({
        name: 'softDelete',
        model: {
            $allModels: {
                async delete<T>(this: T, where: Prisma.Args<T, 'delete'>['where']) {
                    const context = Prisma.getExtensionContext(this)
                    return await (context as any).update({
                        ...where,
                        data: { isDeleted: true, deletedBy: clsService.get('userId'), deletedAt: new Date() }
                    })
                },
                async deleteMany<T>(this: T, where: Prisma.Args<T, 'deleteMany'>['where']) {
                    const context = Prisma.getExtensionContext(this)
                    return await (context as any).updateMany({
                        ...where,
                        data: { isDeleted: true, deletedBy: clsService.get('userId'), deletedAt: new Date() }
                    })
                }
            }
        }
    })
