import {sequelize} from "../connection";
import {UsersGroup} from "../models";

export const addUsersToGroup = async (groupId: string, userIds: string[]): Promise<any> => {
    try {

        // @ts-ignore why does it complain?
        const result = await sequelize.transaction(async (t) => {

            // @ts-ignore why does it complain?
            const res = await UsersGroup.create({
                group_id: groupId,
                users_id: userIds.join(','),
            }, { transaction: t });

            return result;
        });
    } catch (error) {
        console.log(error, 'addUsersToGroup');
    }
}