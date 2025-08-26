import { spawn } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

async function run() {
    const rl = readline.createInterface({ input: stdin, output: stdout })
    const inputEnv = (await rl.question('환경 (local/dev/prod): ')).trim()
    rl.close()

    const env = inputEnv || process.env.NODE_ENV || 'local'
    const envFilePath = path.resolve(process.cwd(), `./envs/.env.${env}`)
    dotenv.config({ path: envFilePath })

    const seedsDir = path.resolve(process.cwd(), 'libs/prisma/config/seeds')

    // 실행 순서: 파일명 알파벳 순. 필요시 접두 숫자(001_*.ts)로 제어
    const entries = fs
        .readdirSync(seedsDir)
        .filter((f) => f.endsWith('.ts'))
        .filter((f) => f !== 'run.ts' && !f.endsWith('.d.ts'))
        .sort()

    if (entries.length === 0) {
        console.log('⚠️ 실행할 시드가 없습니다.')
        return
    }

    console.log(`🚀 시드 실행 시작 (env=${env})`)

    for (const file of entries) {
        const abs = path.join(seedsDir, file)
        console.log(`➡️  ${file} 실행`)

        await new Promise<void>((resolve, reject) => {
            const child = spawn('npx', ['-y', 'tsx', abs], {
                stdio: 'inherit',
                env: { ...process.env, NODE_ENV: env }
            })
            child.on('exit', (code) => {
                if (code === 0) return resolve()
                reject(new Error(`${file} 실패 (exit ${code})`))
            })
            child.on('error', reject)
        })
    }

    console.log('✅ 모든 시드 실행 완료')
}

run().catch((e) => {
    console.error('❌ 시드 실행 중 오류:', e)
    process.exit(1)
})
