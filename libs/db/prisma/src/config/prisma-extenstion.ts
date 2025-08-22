import { Prisma } from '@prisma/client'
import { ClsService } from 'nestjs-cls'

const findOperations = ['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'] as const
type FindOperation = (typeof findOperations)[number]

export const filterSoftDeleted = Prisma.defineExtension({
    name: 'filterSoftDeleted',
    query: {
        $allModels: {
            async $allOperations({ operation, args, query }) {
                const hasWithDeleted = 'withDeleted' in args
                if (hasWithDeleted) {
                    delete args.withDeleted
                    return query(args)
                }
                if (findOperations.includes(operation as FindOperation)) {
                    if (!('where' in args) || !args.where) {
                        args['where'] = { isDeleted: false }
                    } else {
                        args.where = { AND: [args.where as any, { isDeleted: false }] }
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

export const softDelete = (clsService: ClsService) =>
    Prisma.defineExtension({
        name: 'softDelete',
        model: {
            $allModels: {
                async softDelete<T>(this: T, args: Prisma.Args<T, 'delete'>) {
                    const context = Prisma.getExtensionContext(this)
                    return await (context as any).update({
                        ...args,
                        data: { isDeleted: true, deletedBy: clsService.get('userId'), deletedAt: new Date() }
                    })
                },
                async softDeleteMany<T>(this: T, where: Prisma.Args<T, 'deleteMany'>['where']) {
                    const context = Prisma.getExtensionContext(this)
                    return await (context as any).updateMany({
                        where,
                        data: { isDeleted: true, deletedBy: clsService.get('userId'), deletedAt: new Date() }
                    })
                }
            }
        }
    })
