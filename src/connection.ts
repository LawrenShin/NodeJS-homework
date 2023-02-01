import {Sequelize} from "sequelize";

// use process environments for credentials. You can use dotenv file for that. 
// And create .env.template or .env.example for env file.
export const sequelize = new Sequelize(
    `postgres://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@localhost:5432/users_node_homework`
);
