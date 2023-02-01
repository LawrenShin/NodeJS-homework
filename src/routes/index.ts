import express from "express";
import { usersRouter } from "./users";

const appRouter = express.Router();

appRouter.use("/users", usersRouter);

export { appRouter };