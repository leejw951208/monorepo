import { HttpException } from '@nestjs/common'
import { IErrorCodes } from './error.code'

export type LogLevel = 'warn' | 'error'

export class BaseException extends HttpException {
    public readonly logLevel: LogLevel

    constructor(error: IErrorCodes, location: string, logLevel: LogLevel = 'error') {
        super(
            {
                errorCode: error.errorCode,
                message: error.message,
                location: location
            },
            error.status
        )
        this.logLevel = logLevel
    }
}
