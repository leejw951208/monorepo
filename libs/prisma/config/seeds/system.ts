import { Owner, PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'

async function main() {
    const env = process.env.NODE_ENV || 'local'
    const envFilePath = path.resolve(process.cwd(), `./envs/.env.${env}`)
    dotenv.config({ path: envFilePath })

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL 이 설정되지 않았습니다.')
        process.exit(1)
    }

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    })

    try {
        // FK 순서대로 삭제 (RolePermission -> AdminRole -> UserRole -> Permission -> Role)
        await prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany()
            await tx.permission.deleteMany()
            await tx.role.deleteMany()
        })

        // 1) Role 보장 (ADMIN@ADMIN)
        const role = await prisma.role.create({
            data: { name: 'ADMIN', owner: Owner.ADMIN, description: '시스템 관리자', createdBy: 1 }
        })

        // 2) Permission upsert (scope, action 고유)
        const permissions = [
            { scope: 'user', action: 'create', createdBy: 1 },
            { scope: 'user', action: 'read', createdBy: 1 },
            { scope: 'user', action: 'update', createdBy: 1 },
            { scope: 'user', action: 'delete', createdBy: 1 }
        ]

        for (const p of permissions) {
            const perm = await prisma.permission.create({
                data: {
                    scope: p.scope,
                    action: p.action,
                    createdBy: 1
                }
            })

            await prisma.rolePermission.create({
                data: {
                    roleId: role.id,
                    permissionId: perm.id,
                    createdBy: 1
                }
            })
        }

        console.log('✅ Seeding 완료')
    } catch (error) {
        console.error('❌ Seeding 실패:', error)
        process.exitCode = 1
    } finally {
        await prisma.$disconnect()
    }
}

main()
