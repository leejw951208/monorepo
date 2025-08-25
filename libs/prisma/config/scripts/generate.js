#!/usr/bin/env node

const { execSync } = require('child_process')
const dotenv = require('dotenv')
const path = require('path')
const readline = require('node:readline/promises')
const { stdin, stdout } = require('node:process')

async function main() {
    // 1) 사용자에게 환경(prompt)과 파일명(prompt) 입력받기

    const rl = readline.createInterface({ input: stdin, output: stdout })
    const env = (await rl.question('환경 (local/dev): ')).trim()
    const migrationName = (await rl.question('마이그레이션 파일명: ')).trim()
    rl.close()

    // 2) .env 파일 로드
    const envFilePath = path.resolve(process.cwd(), `./envs/.env.${env}`)
    dotenv.config({ path: envFilePath })

    // 3) 입력 검증
    if (!env || !migrationName) {
        console.error('❌ 환경과 마이그레이션 파일명을 모두 입력해야 합니다.')
        process.exit(1)
    }

    // 4) 마이그레이션 파일 생성
    try {
        console.log(`📝 ${env} 환경에서 마이그레이션 파일을 생성합니다: ${migrationName}`)
        const schemaPath = `${path.resolve(process.cwd())}${process.env.PRISMA_SCHEMA_PATH}`
        execSync(`npx prisma migrate dev --name ${migrationName} --create-only --schema=${schemaPath}`, { stdio: 'inherit' })
        console.log('✅ 마이그레이션 파일이 생성되었습니다. 파일을 검토 및 수정한 후, 별도의 스크립트를 통해 적용하세요.')
    } catch {
        console.error('❌ 마이그레이션 파일 생성 중 오류가 발생했습니다.')
        process.exit(1)
    }
}

main()
