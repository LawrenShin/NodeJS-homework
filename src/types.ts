
// interfaces
export interface IUserBasic {
    login: string;
    password: string;
    age: number;
}
export interface IUserToClient extends IUserBasic{
    id: string;
}
export interface IUserToService extends IUserToClient {
    isdeleted: boolean;
}
export interface MappedErrors {
    errors: {
        path: Array<string | number>;
        message: string
    }[];
    status: string
}
