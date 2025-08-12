import { AuthErrorType, BadRequestType, NotFoundType, PostErrorType, ServerErrorType, UserErrorType } from './error.type'

export interface IErrorCodes {
    errorCode: string
    status: number
    message: string
}

export const AUTH_ERROR: {
    [key in AuthErrorType]: IErrorCodes
} = {
    MISSING_ACCESS_TOKEN: {
        status: 401,
        errorCode: 'AUTH_ERROR_000',
        message: '인증 토큰을 찾을 수 없습니다.'
    },
    INVALID_ACCESS_TOKEN: {
        status: 401,
        errorCode: 'AUTH_ERROR_001',
        message: '유효하지 않은 인증 토큰입니다.'
    },
    INVALID_REFRESH_TOKEN: {
        status: 401,
        errorCode: 'AUTH_ERROR_002',
        message: '유효하지 않은 리프레시 토큰입니다.'
    },
    PASSWORD_NOT_MATCHED: {
        status: 401,
        errorCode: 'AUTH_ERROR_003',
        message: '비밀번호가 일치하지 않습니다.'
    },
    RESOURCE_ACCESS_DENIED: {
        status: 403,
        errorCode: 'AUTH_ERROR_004',
        message: '리소스 접근 권한이 없습니다.'
    }
}

export const USER_ERROR: {
    [key in UserErrorType]: IErrorCodes
} = {
    NOT_FOUND: {
        status: 404,
        errorCode: 'USER_ERROR_001',
        message: '회원 정보를 찾을 수 없습니다.'
    }
}

export const POST_ERROR: {
    [key in PostErrorType]: IErrorCodes
} = {
    NOT_FOUND: {
        status: 404,
        errorCode: 'POST_ERROR_001',
        message: '게시글을 찾을 수 없습니다.'
    }
}

// 공통 에러 코드
export const BAD_REQUEST: {
    [key in BadRequestType]: IErrorCodes
} = {
    GENERAL: {
        status: 400,
        errorCode: 'BAD_REQUEST_001',
        message: '잘못된 요청 입니다.'
    }
}

export const NOT_FOUND: {
    [key in NotFoundType]: IErrorCodes
} = {
    GENERAL: {
        status: 404,
        errorCode: 'NOT_FOUND_001',
        message: '리소스를 찾을 수 없습니다.'
    }
}

export const SERVER_ERROR: {
    [key in ServerErrorType]: IErrorCodes
} = {
    GENERAL: {
        status: 500,
        errorCode: 'SERVER_ERROR_001',
        message: '요청을 처리하던 중 오류가 발생 하였습니다'
    }
}
