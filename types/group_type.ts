type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

type IGroup = {
    id?: string,
    name: string,
    permission: Array<Permission>
}

export { IGroup };