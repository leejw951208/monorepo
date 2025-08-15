export class DbCommon {
    id: number
    createdAt: Date
    createdBy: number
    updatedAt: Date | null = null
    updatedBy: number | null = null
    isDeleted: boolean | null = null
    deletedAt: Date | null = null
    deletedBy: number | null = null
}
