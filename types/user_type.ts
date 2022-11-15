type IUser = {
    id?: string,
    login: string,
    password: string,
    age: number,
    isDeleted: boolean
}

type IUserWithOptionalFields = {
    id?: string,
    login?: string,
    password?: string,
    age?: number,
    isDeleted?: boolean
}

export { IUser, IUserWithOptionalFields };