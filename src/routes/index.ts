import express from "express";
import { usersRouter } from "./users";

const appRouter = express.Router();

// you can collect the main resources (endpoints) at here and export a single router for applicaiton
appRouter.use("/users", usersRouter);

export { appRouter };