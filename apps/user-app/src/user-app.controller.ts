import { Public } from '@libs/common/decorator/public.decorator'
import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserAppService } from './user-app.service'

const path = 'common'
@ApiTags(path)
@ApiBearerAuth('JWT-Auth')
@Controller({ path })
export class UserAppController {
    constructor(private readonly service: UserAppService) {}

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
