// async function main() {
//     const env = process.env.NODE_ENV || 'local'
//     const envFilePath = path.resolve(process.cwd(), `./envs/.env.${env}`)
//     dotenv.config({ path: envFilePath })

//     if (!process.env.DATABASE_URL) {
//         console.error('❌ DATABASE_URL 이 설정되지 않았습니다.')
//         process.exit(1)
//     }

//     const prisma = new PrismaClient({
//         datasources: {
//             db: {
//                 url: process.env.DATABASE_URL
//             }
//         }
//     })

//     const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)

//     try {
//         console.log(`🚀 Seeding (env=${env}) 시작`)

//         await prisma.user.create({
//             data: {
//                 loginId: 'admin',
//                 password: 'password1234',
//                 email: 'admin@example.com',
//                 name: '관리자',
//                 phone: '010-0000-0000',
//                 createdBy: 0,
//                 userRoles: {
//                     create: {
//                         roleId: 1,
//                         createdBy: 0
//                     }
//                 }
//             }
//         })

//         // 3) Role 보장 (USER, ADMIN)
//         const rolesToEnsure = [
//             { name: 'USER', site: Site.USER, description: '기본 사용자', createdBy: 0 },
//             { name: 'ADMIN', site: Site.ADMIN, description: '시스템 관리자', createdBy: 0 }
//         ]

//         const roleNameToId: Record<string, number> = {}
//         for (const r of rolesToEnsure) {
//             const existing = await prisma.role.findFirst({ where: { name: r.name, site: r.site } })
//             let role
//             if (existing) {
//                 role = existing
//             } else {
//                 role = await prisma.role.create({ data: r })
//             }
//             roleNameToId[`${r.site}:${r.name}`] = role.id
//         }

//         // 4) User 시드 (loginId/email unique 기준 upsert)
//         const users = [
//             {
//                 loginId: 'user1',
//                 password: 'password1234',
//                 email: 'user1@example.com',
//                 name: '사용자1',
//                 phone: '010-0000-0001',
//                 createdBy: 0
//             },
//             {
//                 loginId: 'user2',
//                 password: 'password1234',
//                 email: 'user2@example.com',
//                 name: '사용자2',
//                 phone: '010-0000-0002',
//                 createdBy: 0
//             }
//         ]

//         for (const u of users) {
//             const hashed = await bcrypt.hash(u.password, saltRounds)
//             await prisma.user.upsert({
//                 where: { loginId: u.loginId },
//                 update: {
//                     password: hashed,
//                     email: u.email,
//                     name: u.name,
//                     phone: u.phone,
//                     updatedBy: 0
//                 },
//                 create: {
//                     loginId: u.loginId,
//                     password: hashed,
//                     email: u.email,
//                     name: u.name,
//                     phone: u.phone,
//                     createdBy: u.createdBy
//                 }
//             })
//         }

//         // 5) User-Role 연결 (모든 사용자 -> USER 역할 연결)
//         const userRole = await prisma.role.findFirst({ where: { name: 'USER', site: Site.USER } })
//         if (!userRole) {
//             throw new Error('USER 역할이 존재하지 않습니다.')
//         }

//         const allUsers = await prisma.user.findMany({ where: { isDeleted: false } })
//         for (const user of allUsers) {
//             await prisma.userRole.upsert({
//                 where: { userId_roleId: { userId: user.id, roleId: userRole.id } },
//                 update: {},
//                 create: { userId: user.id, roleId: userRole.id, createdBy: 0 }
//             })
//         }

//         console.log('✅ Seeding 완료')
//     } catch (error) {
//         console.error('❌ Seeding 실패:', error)
//         process.exitCode = 1
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// main()
