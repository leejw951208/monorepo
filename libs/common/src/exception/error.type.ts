const GeneralType = 'GENERAL'
const NotFoundType = 'NOT_FOUND'
export type SeedErrorType = typeof GeneralType
export type BadRequestType = typeof GeneralType
export type NotFoundType = typeof GeneralType
export type ServerErrorType = typeof GeneralType
export type AuthErrorType =
    | 'MISSING_ACCESS_TOKEN'
    | 'INVALID_ACCESS_TOKEN'
    | 'INVALID_REFRESH_TOKEN'
    | 'PASSWORD_NOT_MATCHED'
    | 'RESOURCE_ACCESS_DENIED'
export type UserErrorType = typeof NotFoundType
