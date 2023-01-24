import express from 'express';
import {sequelize} from "./connection";
import {middlewares} from "./dataAccess";

export const app = express();
export const router = express.Router();
export const port = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('connected');
    })
    .catch(err => {
        console.log(err)
    });

const {
    getUserListByName,
    removeUser,
    updateUser,
    getUser,
    getUserList,
    addUser,
} = middlewares;

// API by id
router.route('/users/:id')
    .get(getUser)
    .delete(removeUser)
    .patch(updateUser);

// API list
router.route('/users')
    .post(addUser)
    .get(getUserList);
router.route('/users/byName/:login')
    .get(getUserListByName);

app.use(express.json());
app.use(router);
app.listen(port);

// Note: Sorry, as I am running late for homeworks this one is a little bit unfinished with splitting
// please advice me on how to split routes with loaders. I was not able to plit it properly and keep my app working. Getting errors such as => Cannot GET /users</