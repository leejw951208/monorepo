import { CommonModule } from '@libs/common/common.module'
import { JwtStrategy } from '@libs/common/strategy/jwt.strategy'
import { LocalStrategy } from '@libs/common/strategy/local.strategy'
import { TokenRepository } from '@libs/models/token/token.repository'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from 'apps/api/src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY')
            })
        }),
        CommonModule,
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService, TokenRepository, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
