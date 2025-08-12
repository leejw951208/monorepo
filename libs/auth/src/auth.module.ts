import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
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
        })
    ],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
