import {IUserBasic, IUserToClient, IUserToService, MappedErrors} from "../types";
import {Schema, ValidationErrorItem, ValidationResult} from "joi";
import {User} from "../models";
import {userSchema} from "./validationSchemas";


// if the below codes related to the User logic mode them to a seperate UserService.ts file. and you can export it here or directly from its own file.

export const validateUser = (newUser: IUserToService): ValidationResult<Schema<IUserBasic>> => {
    return userSchema.validate(newUser, { abortEarly: false, allowUnknown: false });
};

export const noServiceFields = (data: IUserToService[] | IUserToService): IUserToClient[] | IUserToClient => {
    if (Array.isArray(data)) {
        return data.map(({isdeleted, ...rest}) => rest);
    }
    const {isdeleted, ...rest} = data;
    return rest;
};

export const mapErrors = (schemaErrors: ValidationErrorItem[]): MappedErrors => {
    const errors = schemaErrors.map(({ message, path }) => ({ message, path }));

    return {
        status: 'failed',
        errors,
    };
};

export const userGetter = async (id?: string) => {
    const options = {raw: true};

    if (id) {
        // this finding user from database etc. is basically a dataAccess operation.
        // So you can make a UserDAL.ts (user data access layer) file or UserDAO.ts (user data access object) under dataaccess folder
        // pick one of the naming. just be consistent.
        // and you can then use it like;
        /**
         const user = await UserDAL.findOne(id); // we dont care how data is getting fetched. we just code our logic and ask dataaccess to bring us data.
         */
        const result = await User.findOne({where: {id: id}, ...options});
        if (result?.isdeleted) {
            return null;
        }
        return result;
    } else {
        const result = await User.findAll(options);
        return result.filter(r => !r.isdeleted);
    }
};

export const handleUserCreation = async <T extends IUserBasic>(newUser: T) => {
    const options = {raw: true};
    const conditions = {where: {login: newUser.login}};
    const isPresent = await User.findOne({...options, ...conditions});
    if (isPresent)
        return false;

    // @ts-ignore
    return (await User.create(newUser, options)).get(options);
}

export const handleUpdateUser = async (id: string, updates: Partial<IUserToClient>) => {
    return await User.update(updates, {where: {id}});
};

export const handleUserListByName = async (login: string, limit?: string): Promise<IUserToClient[] | []> => {
    const options = {raw: true, includes: {login}};
    const list = (await User.findAll(limit ? {...options, limit: Number(limit)} : options))
        .filter(u => ~u.login.indexOf(login))
        .sort((u1, u2) => u1.login.localeCompare(u2.login));

    const clientReadyList = noServiceFields(list);
    if (Array.isArray(clientReadyList)) {
        return clientReadyList;
    }

    return [];
};
