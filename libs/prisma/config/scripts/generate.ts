import dotenv from 'dotenv'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'

async function main(): Promise<void> {
    // 1) 사용자에게 환경(prompt)과 파일명(prompt) 입력받기
    const rl = createInterface({ input: stdin, output: stdout })
    const env = (await rl.question('환경 (local/dev): ')).trim()
    rl.close()

    // 2) .env 파일 로드
    const envFilePath = resolve(process.cwd(), `./envs/.env.${env}`)
    dotenv.config({ path: envFilePath })

    // 3) 입력 검증
    if (!env) {
        console.error('❌ 환경을 입력해야 합니다.')
        process.exit(1)
    }

    // 4) 마이그레이션 파일 생성
    try {
        console.log(`📝 ${env} 환경에서 Prisma 설정 업데이트를 진행합니다.`)
        const schemaPath = `${resolve(process.cwd())}${process.env.PRISMA_SCHEMA_PATH}`
        execSync(`npx prisma generate --schema=${schemaPath}`, { stdio: 'inherit' })
        console.log('✅ Prisma 설정 업데이트가 완료되었습니다.')
    } catch (error) {
        console.error('❌ Prisma 설정 업데이트 중 오류가 발생했습니다.')
        process.exit(1)
    }
}

void main()
