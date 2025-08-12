import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { Strategy } from 'passport-local'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    // constructor(private authService: AuthService) {
    //     super({ usernameField: 'email', passwordField: 'password' })
    // }
    // async validate(email: string, password: string): Promise<Omit<User, 'password'>> {
    //     return await this.authService.validate(email, password)
    // }
}
