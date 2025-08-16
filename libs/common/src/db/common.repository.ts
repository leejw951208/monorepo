import { CommonModel } from '@libs/common/db/common.model'
import { DbService } from '@libs/db/db.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ClsService } from 'nestjs-cls'

type Tx = Prisma.TransactionClient

@Injectable()
export class CommonRepository<T extends CommonModel> {
    private readonly model: Prisma.ModelName
    private readonly delegate?: any

    constructor(
        private readonly db: DbService,
        private readonly cls: ClsService,
        model: Prisma.ModelName,
        delegate?: any
    ) {
        this.model = model
        this.delegate = delegate
    }

    /** 내부에서 사용할 delegate(prisma.<model> or tx.<model>) 선택 */
    private get d(): any {
        return this.delegate ?? this.db[this.model]
    }

    /** 주어진 tx에 바인딩된 레포 인스턴스 생성 */
    withTx(tx: Tx): CommonRepository<T> {
        const txDelegate = (tx as any)[this.model]
        return new CommonRepository<T>(this.db, this.cls, this.model, txDelegate)
    }

    async findOne(where: Partial<T>, withDeleted = false): Promise<T | null> {
        return await this.d.findFirst({ where: { ...where, isDeleted: withDeleted }, orderBy: { id: 'desc' } })
    }

    async findMany(where: Partial<T>, withDeleted = false): Promise<T[]> {
        return await this.d.findMany({ where: { ...where, isDeleted: withDeleted }, orderBy: { id: 'desc' } })
    }

    async insert(model: T): Promise<T> {
        return await this.d.create({ data: { ...model, createdAt: new Date(), createdBy: this.cls.get('userId'), isDeleted: false } })
    }

    async insertMany(models: T[]): Promise<T[]> {
        return await this.d.createMany({
            data: models.map((model) => ({ ...model, createdAt: new Date(), createdBy: this.cls.get('userId'), isDeleted: false }))
        })
    }

    async update(pk: number, data: Partial<T>, withDeleted = false): Promise<T> {
        return await this.d.update({
            where: { id: pk },
            data: { ...data, updatedAt: new Date(), updatedBy: this.cls.get('userId'), isDeleted: withDeleted }
        })
    }

    async updateMany(where: Partial<T>, data: Partial<T>, withDeleted = false): Promise<T> {
        return await this.d.updateMany({
            where,
            data: { ...data, updatedAt: new Date(), updatedBy: this.cls.get('userId'), isDeleted: withDeleted }
        })
    }

    async softDelete(pk: number, data?: Partial<T>): Promise<void> {
        await this.d.update({
            where: { id: pk },
            data: { isDeleted: true, deletedAt: new Date(), deletedBy: this.cls.get('userId'), ...data }
        })
    }

    async softDeleteMany(where: Partial<T>, data?: Partial<T>): Promise<void> {
        await this.d.updateMany({
            where,
            data: { isDeleted: true, deletedAt: new Date(), deletedBy: this.cls.get('userId'), ...data }
        })
    }

    async delete(pk: number): Promise<void> {
        await this.d.delete({ where: { id: pk } })
    }

    async deleteMany(where: Partial<T>): Promise<void> {
        await this.d.deleteMany({ where })
    }
}
