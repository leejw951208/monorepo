import { CommonRepository } from '@libs/common/db/common.repository'
import { PRISMA_SERVICE } from '@libs/db/db.module'
import { DbService } from '@libs/db/db.service'
import { TokenModel } from '@libs/models/token/token.model'
import { Inject, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class TokenRepository extends CommonRepository<TokenModel> {
    constructor(@Inject(PRISMA_SERVICE) dbService: DbService, clsService: ClsService) {
        super(dbService, clsService, Prisma.ModelName.Token)
    }
}
