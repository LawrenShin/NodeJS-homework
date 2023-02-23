import {Group, IGroup} from "../models";
import {baseOptions, Options} from "./UserDAO";

const GroupDAO = {
        getAll: () => Group.findAll(),
        create: (group: IGroup) => Group.create(group, baseOptions),
        delete: (id: string) => Group.destroy({where: {id: id}}),
        getConditionally :(options?: Options): Promise<Group | Group[] | null> => Group.findOne({...options, ...baseOptions}),
        update: (id: string, updates: Partial<IGroup>) => Group.update(updates, {where: {id}}),
        getById: (id: string, options?: Options) => Group.findOne({where: {id: id}, ...options, ...baseOptions}),
    }
;

export default GroupDAO;