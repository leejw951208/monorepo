import { CommonRepository } from '@libs/common/db/common.repository'
import { PRISMA_SERVICE } from '@libs/db/db.module'
import { DbService } from '@libs/db/db.service'
import { UserModel } from '@libs/models/user/user.model'
import { Inject, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class UserRepository extends CommonRepository<UserModel> {
    constructor(@Inject(PRISMA_SERVICE) dbService: DbService, clsService: ClsService) {
        super(dbService, clsService, Prisma.ModelName.User)
    }
}
