import { JwtStrategy } from '@libs/common/strategy/jwt.strategy'
import { BcryptUtil } from '@libs/common/utils/bcrypt.util'
import { JwtUtil } from '@libs/common/utils/jwt.util'
import { Module } from '@nestjs/common'

@Module({
    providers: [BcryptUtil, JwtUtil, JwtStrategy],
    exports: [BcryptUtil, JwtUtil, JwtStrategy]
})
export class CommonModule {}
