import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { ApiService } from './api.service'
import { Public } from '@libs/common/decorator/public.decorator'

const path = 'common'
@ApiTags(path)
@ApiBearerAuth('JWT-Auth')
@Controller({ path })
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @ApiOperation({ summary: 'Health Check' })
    @ApiResponse({ status: HttpStatus.OK })
    @Public()
    @Get('health')
    health() {
        return {
            status: 'ok'
        }
    }
}
