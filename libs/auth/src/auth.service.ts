import { PRISMA_SERVICE } from '@libs/db/prisma.module'
import { PrismaService } from '@libs/db/prisma.service'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(PRISMA_SERVICE) private readonly prisma: PrismaService
    ) {}
}
