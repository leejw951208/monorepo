import { UserCursorPageReqDto, UserOffsetPageReqDto } from '@apps/api/user/dto/user-page-req.dto'
import { UserResDto } from '@apps/api/user/dto/user-res.dto'
import { ApiCursorPageOkResponse, ApiOffsetPageOkResponse } from '@libs/common/decorator/api-page-ok-response.decorator'
import { Public } from '@libs/common/decorator/public.decorator'
import { CursorPageResDto, OffsetPageResDto } from '@libs/common/dto/page-res.dto'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

const path = 'user'
@ApiTags(path)
@ApiBearerAuth('JWT-Auth')
@Controller(path)
export class UserController {
    constructor(private readonly service: UserService) {}

    @ApiOperation({
        summary: '회원 페이지 조회, Offset',
        description: '회원 페이지 조회'
    })
    @ApiOffsetPageOkResponse(UserResDto)
    @Get('offset')
    async findUsers(@Query() query: UserOffsetPageReqDto): Promise<OffsetPageResDto<UserResDto>> {
        return this.service.findUsersWithOffset(query)
    }

    @ApiOperation({
        summary: '회원 페이지 조회, Cursor',
        description: '회원 페이지 조회'
    })
    @ApiCursorPageOkResponse(UserResDto)
    @Get('cursor')
    async findUsersWithCursor(@Query() query: UserCursorPageReqDto): Promise<CursorPageResDto<UserResDto>> {
        return this.service.findUsersWithCursor(query)
    }

    @ApiOperation({
        summary: 'Typed SQL 테스트',
        description: 'Typed SQL 테스트'
    })
    @Public()
    @Get('typed-sql')
    async test(): Promise<void> {
        this.service.typedSql()
    }
}
