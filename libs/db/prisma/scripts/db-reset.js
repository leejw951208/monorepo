#!/usr/bin/env node

import { execSync } from 'child_process'
import dotenv from 'dotenv'
import path from 'path'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

async function main() {
    // 환경 입력
    const schemaPath = `${path.resolve(process.cwd())}/libs/db/src/prisma`
    const rl = readline.createInterface({ input: stdin, output: stdout })
    const env = (await rl.question('환경 (local/dev): ')).trim()
    rl.close()

    // 환경 체크
    if (!env || (env !== 'local' && env !== 'dev')) {
        console.error('❌ 지원되지 않는 환경입니다. local 또는 dev만 허용됩니다.')
        process.exit(1)
    }

    // .env 파일 로드
    const envFilePath = path.resolve(process.cwd(), `./envs/.env.${env}`)
    dotenv.config({ path: envFilePath })

    try {
        console.log(`🚨 ${env} 환경 데이터베이스를 초기화합니다...`)
        execSync(`npx prisma migrate reset --force --schema=${schemaPath}`, { stdio: 'inherit' })
    } catch (error) {
        console.error('❌ DB 초기화 중 오류가 발생했습니다.')
        process.exit(1)
    }
}

main()
