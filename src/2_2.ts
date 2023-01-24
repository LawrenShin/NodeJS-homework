import Joi from 'joi';
import {InferAttributes, InferCreationAttributes, Model} from "sequelize";

export const userSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    age: Joi.number()
        .min(4)
        .max(130)
        .required()
});

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

// model types
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string;
    declare login: string;
    declare password: string;
    declare age: number;
    declare isdeleted: boolean;
}