import { execSync } from 'node:child_process'
import dotenv from 'dotenv'
import { resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

async function main(): Promise<void> {
    // 환경 입력
    const rl = createInterface({ input: stdin, output: stdout })
    const env = (await rl.question('환경 (local/dev): ')).trim()
    rl.close()

    // 환경 체크
    if (!env || (env !== 'local' && env !== 'dev')) {
        console.error('❌ 지원되지 않는 환경입니다. local 또는 dev만 허용됩니다.')
        process.exit(1)
    }

    // .env 파일 로드
    const envFilePath = resolve(process.cwd(), `./envs/.env.${env}`)
    dotenv.config({ path: envFilePath })

    try {
        console.log(`🚨 ${env} 환경 데이터베이스를 초기화합니다...`)
        const schemaPath = `${resolve(process.cwd())}${process.env.PRISMA_SCHEMA_PATH}`
        execSync(`npx prisma migrate reset --force --schema=${schemaPath}`, { stdio: 'inherit' })
    } catch (error) {
        console.error('❌ DB 초기화 중 오류가 발생했습니다.')
        process.exit(1)
    }
}

void main()
