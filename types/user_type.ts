type User = {
    id?: string,
    login: string,
    password: string,
    age: number,
    isDeleted: boolean
}

type UserWithOptionalFields = {
    id?: string,
    login?: string,
    password?: string,
    age?: number,
    isDeleted?: boolean
}

export { User, UserWithOptionalFields };