import express from "express";
import {addGroup, getGroup, getGroups, removeGroup, updateGroup} from "../dataAccess/groupOperations";


const groupsRouter = express.Router();

groupsRouter.route("/:id")
    .get(getGroup)
    .delete(removeGroup)
    .patch(updateGroup);

groupsRouter.route("/")
    .post(addGroup)
    .get(getGroups);

export { groupsRouter };