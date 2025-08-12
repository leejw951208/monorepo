import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'

export function setupSwagger(app: INestApplication): void {
    const configService = app.get(ConfigService)

    const title = `${configService.get<string>('APP_NAME')} API Documents`
    const version = `${configService.get<string>('APP_VERSION')}`
    const description = ``

    const swaggerUri = `${configService.get<string>('API_PREFIX')}/${configService.get<string>('API_VERSIONING')}/${configService.get<string>('SWAGGER_URI')}`

    const documentConfig = new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header'
            },
            'JWT-Auth'
        )
        .build()
    const documentOption: SwaggerDocumentOptions = {
        ignoreGlobalPrefix: false,
        extraModels: []
    }
    const customOptions: SwaggerCustomOptions = {
        customSiteTitle: title,
        customfavIcon: '',
        yamlDocumentUrl: `${swaggerUri}/yaml`,
        jsonDocumentUrl: `${swaggerUri}/json`,
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none'
        }
    }

    const document = SwaggerModule.createDocument(app, documentConfig, documentOption)
    SwaggerModule.setup(swaggerUri, app, document, customOptions)
}
