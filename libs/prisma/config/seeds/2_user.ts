import { BaseException } from '@libs/common/exception/base.exception'
import { SEED_ERROR } from '@libs/common/exception/error.code'
import { Owner, PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'
import bcrypt from 'bcrypt'

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

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)

    try {
        console.log(`🚀 Seeding (env=${env}) 시작`)

        // FK 순서대로 삭제 (UserRole -> User)
        await prisma.$transaction(async (tx) => {
            await tx.userRole.deleteMany()
            await tx.user.deleteMany()
        })

        // 1) User Role 조회
        const userRole = await prisma.role.findFirst({ where: { owner: Owner.USER } })
        if (!userRole) {
            console.error('❌ Seeding 실패: USER 역할이 존재하지 않습니다.')
            throw new BaseException(SEED_ERROR.GENERAL, this.constructor.name)
        }

        // 2) User 생성
        await prisma.user.create({
            data: {
                loginId: 'testuser',
                password: await bcrypt.hash('password1234', saltRounds),
                email: 'testuser@example.com',
                name: '테스트 사용자',
                phone: '010-0000-0000',
                createdBy: 1,
                userRoles: {
                    create: {
                        roleId: userRole.id,
                        createdBy: 1
                    }
                }
            }
        })

        console.log('✅ Seeding 완료')
    } catch (error) {
        console.error('❌ Seeding 실패:', error)
        process.exitCode = 1
    } finally {
        await prisma.$disconnect()
    }
}

main()
