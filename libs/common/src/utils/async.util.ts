export const findAsync = async <T>(arr: T[], predicate: (item: T) => Promise<boolean>): Promise<T | null> => {
    for (const item of arr) {
        if (await predicate(item)) return item
    }
    return null
}
