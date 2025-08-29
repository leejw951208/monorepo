const GeneralType = 'GENERAL'
const NotFoundType = 'NOT_FOUND'
export type SeedErrorType = typeof GeneralType
export type BadRequestType = typeof GeneralType
export type NotFoundType = typeof GeneralType
export type ServerErrorType = typeof GeneralType
export type AuthErrorType =
    | 'MISSING_ACCESS_TOKEN'
    | 'MISSING_REFRESH_TOKEN'
    | 'INVALID_ACCESS_TOKEN'
    | 'INVALID_REFRESH_TOKEN'
    | 'EXPIRED_ACCESS_TOKEN'
    | 'EXPIRED_REFRESH_TOKEN'
    | 'PASSWORD_NOT_MATCHED'
    | 'RESOURCE_ACCESS_DENIED'
export type UserErrorType = typeof NotFoundType | 'ALREADY_EXISTS_LOGIN_ID' | 'ALREADY_EXISTS_EMAIL'
