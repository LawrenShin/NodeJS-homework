import UserDAO from "./UserDAO";
import {IUserBasic, IUserToClient} from "../types";
import {noServiceFields, sortUsersByName} from "../services";


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
