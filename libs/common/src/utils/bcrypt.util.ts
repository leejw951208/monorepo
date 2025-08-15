import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptUtil {
    private readonly saltRounds: number

    constructor(private readonly configService: ConfigService) {
        this.saltRounds = configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10
    }

    async hash(plain: string): Promise<string> {
        return await bcrypt.hash(plain, this.saltRounds)
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plain, hashed)
    }
}
