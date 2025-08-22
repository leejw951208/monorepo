import { JwtStrategy } from '@libs/common/strategy/jwt.strategy'
import { BcryptUtil } from '@libs/common/utils/bcrypt.util'
import { JwtUtil } from '@libs/common/utils/jwt.util'
import { PrismaModule } from '@libs/db/prisma/prisma.module'
import { Module } from '@nestjs/common'

@Module({
    imports: [PrismaModule],
    providers: [BcryptUtil, JwtUtil, JwtStrategy],
    exports: [PrismaModule, BcryptUtil, JwtUtil, JwtStrategy]
})
export class CommonModule {}
