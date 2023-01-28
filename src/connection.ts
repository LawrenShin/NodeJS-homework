import {Sequelize} from "sequelize";

// use process environments for credentials. You can use dotenv file for that. 
// And create .env.template or .env.example for env file. 
export const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/task3'); 