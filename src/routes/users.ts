import express from "express";
import {addUser, getUser, getUserList, getUserListByName, removeUser, updateUser} from "../dataAccess/controllers";

const usersRouter = express.Router();

usersRouter.route("/")
    .post(addUser)
    .get(getUserList);
usersRouter.route("/:id")
    .get(getUser)
    .delete(removeUser)
    .patch(updateUser);

usersRouter.route('/byName/:login')
    .get(getUserListByName);

export { usersRouter };