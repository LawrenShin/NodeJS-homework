import {IUserBasic, IUserToClient, IUserToService} from "../types";
import {Schema, ValidationResult} from "joi";
import {userSchema} from "./validationSchemas";
import {User} from "../models";

export const validateUser = (newUser: IUserToService): ValidationResult<Schema<IUserBasic>> => {
    return userSchema.validate(newUser, { abortEarly: false, allowUnknown: false });
};

export const noServiceFields = (data: IUserToService[] | IUserToService): IUserToClient[] | IUserToClient => {
    if (Array.isArray(data)) {
        return data.map(({ isdeleted, ...rest }) => rest);
    }
    const { isdeleted, ...rest } = data;
    return rest;
};

export const sortUsersByName = (list: User[], login: string) => list
    .filter(u => ~u.login.indexOf(login))
    .sort((u1, u2) => u1.login.localeCompare(u2.login));
