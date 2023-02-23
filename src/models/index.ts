import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {sequelize} from "../connection";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string;
    declare login: string;
    declare password: string;
    declare age: number;
    declare isdeleted: boolean;
}

export type Permission = 'SHARE' | 'READ' | 'DELETE' | 'WRITE' | 'UPLOAD_FILES';
export const permissionsCollection = ['SHARE', 'READ', 'DELETE', 'WRITE', 'UPLOAD_FILES'];

export class Group extends Model<InferAttributes<Group>, InferCreationAttributes<Group>>{
    declare id: string;
    declare name: string;
    declare permissions: Array<Permission>;
}

export interface IGroup {
    id: string;
    name: string;
    permissions: Array<Permission>;
}

export interface IGroupRaw {
    name: string;
    permissions: string;
}

export interface IGroupFormatted {
    name: string;
    permissions: string;
}

export interface IGroupOptional {
    id?: string;
    name?: string;
    permissions?: Array<Permission>;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    login: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isdeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {tableName: 'users', timestamps: false, sequelize});

Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    permissions: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    }
}, {tableName: 'groups', timestamps: false, sequelize});