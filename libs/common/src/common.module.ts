import { BcryptUtil } from '@libs/common/utils/bcrypt.util'
import { JwtUtil } from '@libs/common/utils/jwt.util'
import { Module } from '@nestjs/common'
import { JwtAccessStrategy } from './strategy/jwt-access.strategy'
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy'

@Module({
    providers: [BcryptUtil, JwtUtil, JwtAccessStrategy, JwtRefreshStrategy],
    exports: [BcryptUtil, JwtUtil, JwtAccessStrategy, JwtRefreshStrategy]
})
export class CommonModule {}
