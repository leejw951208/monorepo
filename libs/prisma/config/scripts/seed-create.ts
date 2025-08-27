import fs from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

async function main(): Promise<void> {
    const rl = createInterface({ input: stdin, output: stdout })
    const num = (await rl.question('실행 순서(1, 2): ')).trim()
    const name = (await rl.question('파일명(영문, 확장자 제외): ')).trim()
    rl.close()

    if (!num || !/^\d+$/.test(num)) {
        console.error('❌ 실행 순서는 숫자만 허용됩니다.')
        process.exit(1)
    }
    if (!name) {
        console.error('❌ 파일명을 입력하세요.')
        process.exit(1)
    }

    const normalized = name
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .toLowerCase()

    const seedsDir = path.resolve(process.cwd(), 'libs/prisma/config/seeds')
    const filename = `${num}_${normalized}.ts`
    const target = path.join(seedsDir, filename)

    if (fs.existsSync(target)) {
        console.error(`❌ 이미 존재하는 파일: ${filename}`)
        process.exit(1)
    }

    const template = `import dotenv from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

async function main() {
    const env = process.env.NODE_ENV || 'local'
    const envFilePath = path.resolve(process.cwd(), \`./envs/.env.\${env}\`)
    dotenv.config({ path: envFilePath })

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    })

    try {
        console.log(\`🚀 Seeding (env=\${env}) 시작\`)
        // TODO: write seed
        console.log('✅ Seeding 완료')
    } catch (error) {
        console.error('❌ Seeding 실패:', error)
        process.exitCode = 1
    } finally {
        await prisma.$disconnect()
    }
}

main()
`

    fs.writeFileSync(target, template, { encoding: 'utf8' })
    console.log(`✅ 생성: ${path.relative(process.cwd(), target)}`)
}

void main()
