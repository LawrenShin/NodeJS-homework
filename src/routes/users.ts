// Create a route file for each resource to be exposed, in this case /users
// with this you seperate your routing logic for each resource (endpoint) to related and seperate files
import express from "express";
import { addUser, getUserList } from "../dataAccess/middlewares"; // name this as controller

const usersRouter = express.Router();

usersRouter.route("/")
    .post(addUser)
    .get(getUserList);

// i did a sample above. it is working but you should add others. like below
// usersRouter.route("/:id").get(getUserById)

export { usersRouter };