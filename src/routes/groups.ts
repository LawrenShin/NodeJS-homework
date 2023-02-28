import express from "express";
import {addGroup, getGroup, getGroups, removeGroup, updateGroup} from "../dataAccess/groupOperations";
import {handleAddUsersToGroup} from "../dataAccess/controllers";


const groupsRouter = express.Router();

groupsRouter.route("/:id")
    .get(getGroup)
    .delete(removeGroup)
    .patch(updateGroup);

groupsRouter.route("/")
    .post(addGroup)
    .get(getGroups);

groupsRouter.route('addUsers')
    .post(handleAddUsersToGroup);
// Question = Why addUsersToGroup fails?
// Question = Why simple error handling middleware from express docs, breaks app?

export { groupsRouter };