import { execSync } from 'node:child_process'
import dotenv from 'dotenv'
import { resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

async function main(): Promise<void> {
    // 1) 사용자에게 환경(prompt) 입력받기
    const rl = createInterface({ input: stdin, output: stdout })
    const env = (await rl.question('환경 (local/dev/prod): ')).trim()
    rl.close()

    // 2) .env 파일 로드
    const envFilePath = resolve(process.cwd(), `./envs/.env.${env}`)
    dotenv.config({ path: envFilePath })

    // 3) 입력 검증
    if (!env) {
        console.error('❌ 환경을 입력해야 합니다.')
        process.exit(1)
    }

    // 4) 명령 실행
    try {
        if (env === 'local' || env === 'dev' || env === 'prod') {
            console.log(`🚀 ${env} 환경에서 스튜디오를 실행합니다.`)
            const schemaPath = `${resolve(process.cwd())}${process.env.PRISMA_SCHEMA_PATH}`
            execSync(`npx prisma studio --schema=${schemaPath}`, { stdio: 'inherit' })
        } else {
            console.error(`❌ 지원되지 않는 환경: ${env}`)
            process.exit(1)
        }
    } catch (error) {
        console.error('❌ 스튜디오 실행 중 오류가 발생했습니다.')
        process.exit(1)
    }
}

void main()
