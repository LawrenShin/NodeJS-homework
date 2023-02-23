import express from "express";
import { usersRouter } from "./users";
import { groupsRouter } from "./groups";

const appRouter = express.Router();

appRouter.use("/users", usersRouter);
appRouter.use("/groups", groupsRouter);

export { appRouter };