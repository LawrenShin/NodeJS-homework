import {User} from "../models";
import {IUserToService} from "../types";

export interface Options {
    [key: string]: any;
}

const baseOptions = {raw: true};

const UserDAO = {
    getAll: () => User.findAll(),
    create: (user: IUserToService) => User.create(user, baseOptions),
    getConditionally :(options?: Options): Promise<User | User[] | null> => User.findOne({...options, ...baseOptions}),
    update: (id: string, updates: Partial<IUserToService>) => User.update(updates, {where: {id}}),
    getById: (id: string, options?: Options) => User.findOne({where: {id: id}, ...options, ...baseOptions}),
}
;

export default UserDAO;