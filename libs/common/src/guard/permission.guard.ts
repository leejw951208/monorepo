import { BaseException } from '@libs/common/exception/base.exception'
import { AUTH_ERROR } from '@libs/common/exception/error.code'
import { TokenPayload } from '@libs/common/utils/jwt.util'
import { PrismaService } from '@libs/prisma/prisma.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly cls: ClsService,
        private readonly prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const payload = this.cls.get<TokenPayload>('tokenPayload')
        const pk = payload?.pk
        const aud = payload?.aud
        if (!pk) {
            throw new BaseException(AUTH_ERROR.RESOURCE_ACCESS_DENIED, this.constructor.name)
        }

        const permission = this.reflector.get<{ scope: string; action: string }>('permission', context.getHandler())
        if (!permission) {
            return true
        }

        // aud별 조인 경로
        const whereByAud =
            aud === 'admin'
                ? { rolePermissions: { some: { role: { adminRoles: { some: { adminId: pk } } } } } } // Admin용
                : { rolePermissions: { some: { role: { userRoles: { some: { userId: pk } } } } } } // User용

        const owned = await this.prisma.client.permission.findFirst({
            where: {
                scope: permission.scope,
                action: permission.action,
                ...whereByAud
            }
        })

        return !!owned
    }
}
