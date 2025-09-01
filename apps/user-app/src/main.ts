import { setupSwagger } from '@libs/common/config/swagger.config'
import { GlobalExceptionHandler } from '@libs/common/exception/global-exception-handler'
import { SuccessStatusInterceptor } from '@libs/common/interceptor/success-status-interceptor/success-status-interceptor.interceptor'
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { UserAppModule } from './user-app.module'

async function bootstrap() {
    const app = await NestFactory.create(UserAppModule)
    const configService = app.get(ConfigService)

    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER)
    app.useLogger(logger)
    app.useGlobalFilters(new GlobalExceptionHandler(logger))

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))

    // API 전역 설정
    app.setGlobalPrefix(configService.get<string>('API_PREFIX') ?? 'api')
    app.enableVersioning({
        type: VersioningType.URI,
        prefix: configService.get<string>('API_VERSIONING')?.split('')[0] ?? 'v',
        defaultVersion: configService.get<string>('API_VERSIONING')?.split('')[1] ?? '1'
    })

    app.enableShutdownHooks()

    app.use(cookieParser())

    app.useGlobalInterceptors(new SuccessStatusInterceptor())

    // 스웨거 설정
    setupSwagger(app)

    await app.listen(configService.get<number>('PORT') ?? 3000)
}
bootstrap()
