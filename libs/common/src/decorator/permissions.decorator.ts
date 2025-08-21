import { SetMetadata } from '@nestjs/common'

export const PERMS_KEY = 'perms'
export const Permissions = (scope: string, action: string = 'read') => SetMetadata(PERMS_KEY, { scope, action })
