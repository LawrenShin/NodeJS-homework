// import {errorHandler} from "./services";

require('dotenv').config();
import express from 'express';
import {sequelize} from "./connection";
import { appRouter } from './routes';


export const app = express();
// export const router = express.Router();
export const port = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('connected');
    })
    .catch(err => {
        console.log(err)
    });

// If you don't sync your tables wont be created by sequelize
sequelize.sync().then(() => {
    console.log("All models were synchronized successfully.");
});

app.use(express.json());
app.use(appRouter) // using seperated router in routes folder will help you clean up here.
// app.use(errorHandler) // why this fails with role undefined ?
app.listen(port);

// Note: Sorry, as I am running late for homeworks this one is a little bit unfinished with splitting
// - No need to be sorry. All of us are working :). No problem.

// please advice me on how to split routes with loaders. I was not able to plit it properly and keep my app working. Getting errors such as => Cannot GET /users</
// - App is working until this commit. I will make reviews for other things at next commits. 