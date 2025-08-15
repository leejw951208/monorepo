import { CommonRepository } from '@libs/common/db/common.repository'
import { BaseException } from '@libs/common/exception/base.exception'
import { SERVER_ERROR } from '@libs/common/exception/error.code'
import { DbCommon } from '@libs/db/db.common'
import { DbService } from '@libs/db/db.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

type Tx = Prisma.TransactionClient
type TxOptions = {
    isolationLevel?: Prisma.TransactionIsolationLevel
    timeout?: number // ms
    maxWait?: number // ms
}

@Injectable()
export class TransactionManager {
    constructor(private readonly db: DbService) {}

    async runAll<R>(
        repos: CommonRepository<DbCommon>[],
        fn: (boundRepos: CommonRepository<DbCommon>[]) => Promise<R>,
        options?: TxOptions
    ): Promise<R> {
        if (!repos.length) throw new BaseException(SERVER_ERROR.GENERAL, this.constructor.name)
        return this.db.$transaction(async (tx) => {
            const bound = repos.map((r) => r.withTx(tx)) as CommonRepository<DbCommon>[]
            return fn(bound)
        }, options)
    }

    async run<R>(fn: (tx: Tx) => Promise<R>, options?: TxOptions): Promise<R> {
        return this.db.$transaction(async (tx) => fn(tx), options)
    }
}
