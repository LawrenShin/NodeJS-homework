import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {sequelize} from "../connection";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string;
    declare login: string;
    declare password: string;
    declare age: number;
    declare isdeleted: boolean;
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