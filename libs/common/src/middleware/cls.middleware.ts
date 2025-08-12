import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request, Response } from 'express'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class CustomClsMiddleware implements NestMiddleware {
    constructor(
        private readonly cls: ClsService,
        private readonly jwtService: JwtService
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.cls.run(() => {
            this.cls.set('userId', 0)
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.slice(7)
                const { userId } = this.jwtService.decode<{ userId: number }>(token)
                this.cls.set('userId', userId)
            }

            const userAgent = req.headers['user-agent'] ?? 'unknown'
            this.cls.set('userAgent', userAgent)

            const clientIp = req.headers['x-forwarded-for']?.[0]?.trim() || req.socket.remoteAddress
            this.cls.set('clientIp', clientIp)

            next()
        })
    }
}
