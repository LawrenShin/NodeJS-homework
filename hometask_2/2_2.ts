import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

export const userSchema = Joi.object({
    id: Joi.string().default(uuidv4()),
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
export interface IUserToClient {
    id: string;
    login: string;
    password: string;
    age: number;
}
export interface IUserToService extends IUserToClient {
    isDeleted: boolean;
}
export interface MappedErrors {
    errors: {
        path: Array<string | number>;
        message: string
    }[];
    status: string
}
