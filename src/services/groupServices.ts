import {Schema, ValidationResult} from "joi";
import {groupSchema} from "./validationSchemas";
import {IGroupFormatted, IGroupRaw, Permission, permissionsCollection} from "../models";


export const validateGroup = (newGroup: IGroupFormatted): ValidationResult<Schema<IGroupFormatted>> => {
    return groupSchema.validate(newGroup, { abortEarly: false, allowUnknown: false });
};

export const formatGroup = (raw: IGroupRaw): IGroupFormatted | null => {
    const {name, permissions} = raw;
    try {
        const validatedPermissions: Permission[] = permissions
            .split(',')
            .map(p => {
                if (p && permissionsCollection.includes(p)) {
                    return p.toUpperCase();
                }
            })
            .filter(p => !!p) as unknown as Permission[];
        return {
            name,
            permissions: validatedPermissions.join(','),
        };
    } catch (e) {
        throw e;
    }
}
