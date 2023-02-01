import {IUserBasic, IUserToClient, IUserToService} from "../types";
import {Schema, ValidationResult} from "joi";
import {userSchema} from "./validationSchemas";
import UserDAO from "../dataAccess/UserDAO";
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

export const userGetter = async (id?: string) => {
    if (id) {
        const user = await UserDAO.getById(id);
        if (user?.isdeleted) {
            return null;
        }
        return user;
    } else {
        const allUsers = await UserDAO.getAll();
        return allUsers.filter(r => !r.isdeleted);
    }
};

export const handleUserCreation = async <T extends IUserBasic>(newUser: T) => {
    const options = {raw: true};
    const conditions = {where: {login: newUser.login}};
    const isPresent = await UserDAO.getConditionally({...options, ...conditions});
    if (isPresent)
        return false;

    // @ts-ignore
    return (await UserDAO.create(newUser, options)).get(options);
}

export const handleUpdateUser = async (id: string, updates: Partial<IUserToClient>) => {
    return await UserDAO.update(id, updates);
};

export const handleUserListByName = async (login: string, limit?: string): Promise<IUserToClient[] | []> => {
    const options = {raw: true, includes: {login}};
    const list = (await UserDAO.getConditionally(limit ? {...options, limit: Number(limit)} : options));

    if (!list || !Array.isArray(list))
        return [];

    const sortedList = sortUsersByName(list, login);
    const clientReadyList = noServiceFields(sortedList);

    if (Array.isArray(clientReadyList)) {
        return clientReadyList;
    }

    return [];
};
