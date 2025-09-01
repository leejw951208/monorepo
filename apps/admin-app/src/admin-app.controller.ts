import { Controller, Get } from '@nestjs/common'
import { AdminAppService } from './admin-app.service'

@Controller()
export class AdminAppController {
    constructor(private readonly service: AdminAppService) {}

    @Get('health')
    health() {
        return {
            status: 'ok'
        }
    }
}
