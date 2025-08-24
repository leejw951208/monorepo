import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger'
import { CursorPageResDto, OffsetPageResDto } from '../dto/page-res.dto'
import { getSchemaPath } from '@nestjs/swagger'

type Opts = { description?: string; dataKey?: string; mode?: 'offset' | 'cursor' }

function ApiPageOkResponse<TModel extends Type<unknown>>(model: TModel, opts: Opts = {}) {
    const dataKey = opts.dataKey ?? 'data'
    const Base = opts.mode === 'cursor' ? CursorPageResDto : OffsetPageResDto

    return applyDecorators(
        // 참고: &&는 잘못됨. 두 DTO 모두 등록해야 $ref가 유효
        ApiExtraModels(OffsetPageResDto, CursorPageResDto, model),
        ApiOkResponse({
            description: opts.description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(Base) },
                    {
                        type: 'object',
                        properties: {
                            [dataKey]: { type: 'array', items: { $ref: getSchemaPath(model) } }
                        }
                    }
                ]
            }
        })
    )
}

export const ApiOffsetPageOkResponse = <T extends Type<unknown>>(m: T, o: Omit<Opts, 'mode'> = {}) =>
    ApiPageOkResponse(m, { ...o, mode: 'offset' })

export const ApiCursorPageOkResponse = <T extends Type<unknown>>(m: T, o: Omit<Opts, 'mode'> = {}) =>
    ApiPageOkResponse(m, { ...o, mode: 'cursor' })
