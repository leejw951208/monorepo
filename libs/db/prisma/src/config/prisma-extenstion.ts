import { Prisma } from '@prisma/client'
import { ClsService } from 'nestjs-cls'

const findOperations = ['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'] as const
type FindOperation = (typeof findOperations)[number]

function mergeWhere<T extends object | undefined>(where: T): any {
    if (!where) return { isDeleted: false }
    return { AND: [where, { isDeleted: false }] }
}

export const filterSoftDeletedExtension = Prisma.defineExtension({
    query: {
        $allModels: {
            async $allOperations({ operation, args, query }: { operation: string; args: any; query: (a: any) => any }) {
                if (args && 'withDeleted' in args) {
                    delete args.withDeleted
                    console.log(operation, args)
                    return query(args)
                }
                if (findOperations.includes(operation as FindOperation)) {
                    args ??= {}
                    args.where = mergeWhere(args.where)
                }
                return query(args)
            }
        }
    }
})

export const createExtension = (cls: ClsService) =>
    Prisma.defineExtension({
        query: {
            $allModels: {
                async create({ args, query }) {
                    const userId = cls.get('userId')
                    args.data = { ...(args.data ?? {}), createdBy: userId }
                    return query(args)
                },
                async createMany({ args, query }) {
                    const userId = cls.get('userId')
                    args.data = Array.isArray(args.data)
                        ? args.data.map((d: any) => ({ ...(d ?? {}), createdBy: userId }))
                        : { ...(args.data ?? {}), createdBy: userId }
                    return query(args)
                }
            }
        }
    })

export const updateExtension = (cls: ClsService) =>
    Prisma.defineExtension({
        query: {
            $allModels: {
                async update(this: object, { args, query }: { args: any; query: any }) {
                    const userId = cls.get('userId')
                    args.data = { ...(args.data ?? {}), updatedBy: userId, updatedAt: new Date() }
                    return query(args)
                },
                async updateMany(this: object, { args, query }: { args: any; query: any }) {
                    const userId = cls.get('userId')
                    args.data = Array.isArray(args.data)
                        ? args.data.map((d: any) => ({ ...(d ?? {}), updatedBy: userId, updatedAt: new Date() }))
                        : { ...(args.data ?? {}), updatedBy: userId, updatedAt: new Date() }
                    return query(args)
                }
            }
        }
    })

export const softDeleteExtension = (cls: ClsService) =>
    Prisma.defineExtension({
        model: {
            $allModels: {
                async softDelete<T>(this: T, args: Omit<Prisma.Args<T, 'update'>, 'data'> & { data?: Prisma.Args<T, 'update'>['data'] }) {
                    const ctx = Prisma.getExtensionContext(this) as any
                    return await ctx.update({
                        ...args,
                        data: { ...(args.data ?? {}), isDeleted: true, deletedBy: cls.get('userId'), deletedAt: new Date() }
                    })
                },
                async softDeleteMany<T>(
                    this: T,
                    args: Omit<Prisma.Args<T, 'updateMany'>, 'data'> & { data?: Prisma.Args<T, 'updateMany'>['data'] }
                ) {
                    const ctx = Prisma.getExtensionContext(this) as any
                    return await ctx.updateMany({
                        ...args,
                        data: { ...(args.data ?? {}), isDeleted: true, deletedBy: cls.get('userId'), deletedAt: new Date() }
                    })
                }
            }
        }
    })
