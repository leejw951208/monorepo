import { UserCursorPageReqDto, UserOffsetPageReqDto } from '@apps/api/user/dto/user-page-req.dto'
import { UserResDto } from '@apps/api/user/dto/user-res.dto'
import { ApiCursorPageOkResponse, ApiOffsetPageOkResponse } from '@libs/common/decorator/api-page-ok-response.decorator'
import { Public } from '@libs/common/decorator/public.decorator'
import { CursorPageResDto, OffsetPageResDto } from '@libs/common/dto/page-res.dto'
import { Controller, Get, Query, Body, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { TokenPayload } from '@libs/common/utils/jwt.util'
import { JwtPayload } from '@libs/common/decorator/jwt-payload.decorator'
import { UserUpdateDto } from '@apps/api/user/dto/user-update.dto'

const path = 'user'
@ApiTags(path)
@ApiBearerAuth('JWT-Auth')
@Controller(path)
export class UserController {
    constructor(private readonly service: UserService) {}

    @ApiOperation({
        summary: '내 정보 조회',
        description: '내 정보 조회'
    })
    @ApiOkResponse({ type: UserResDto })
    @Get('me')
    async findMe(@JwtPayload() payload: TokenPayload): Promise<UserResDto> {
        return this.service.findMe(payload)
    }

    @ApiOperation({
        summary: '내 정보 수정',
        description: '내 정보 수정'
    })
    @ApiBody({ type: UserUpdateDto })
    @ApiOkResponse()
    @Patch('me')
    async updateMe(@JwtPayload() payload: TokenPayload, @Body() reqDto: UserUpdateDto): Promise<void> {
        return this.service.updateMe(payload, reqDto)
    }

    // @ApiOperation({
    //     summary: '회원 페이지 조회, Offset',
    //     description: '회원 페이지 조회'
    // })
    // @ApiOffsetPageOkResponse(UserResDto)
    // @Get('offset')
    // async findUsers(@Query() query: UserOffsetPageReqDto): Promise<OffsetPageResDto<UserResDto>> {
    //     return this.service.findUsersWithOffset(query)
    // }

    // @ApiOperation({
    //     summary: '회원 페이지 조회, Cursor',
    //     description: '회원 페이지 조회'
    // })
    // @ApiCursorPageOkResponse(UserResDto)
    // @Get('cursor')
    // async findUsersWithCursor(@Query() query: UserCursorPageReqDto): Promise<CursorPageResDto<UserResDto>> {
    //     return this.service.findUsersWithCursor(query)
    // }

    // @ApiOperation({
    //     summary: 'Typed SQL 테스트',
    //     description: 'Typed SQL 테스트'
    // })
    // @Public()
    // @Get('typed-sql')
    // async test(): Promise<void> {
    //     this.service.typedSql()
    // }
}
