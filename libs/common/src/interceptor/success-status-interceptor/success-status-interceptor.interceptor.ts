import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs/operators'

@Injectable()
export class SuccessStatusInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const res = context.switchToHttp().getResponse()
        res.status(200) // 항상 200으로 세팅
        return next.handle().pipe(
            map((data) => ({
                statusCode: 200,
                data
            }))
        )
    }
}
