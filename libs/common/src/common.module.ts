import { TransactionManager } from '@libs/common/db/transaction-manager.service'
import { BcryptUtil } from '@libs/common/utils/bcrypt.util'
import { JwtUtil } from '@libs/common/utils/jwt.util'
import { DbService } from '@libs/db/db.service'
import { Module } from '@nestjs/common'

@Module({
    providers: [BcryptUtil, JwtUtil, TransactionManager, DbService],
    exports: [BcryptUtil, JwtUtil, TransactionManager, DbService]
})
export class CommonModule {}
