import {Sequelize} from "sequelize";

export const sequelize = new Sequelize('postgres://newuser:pasword@localhost:5432/users_node_homework');