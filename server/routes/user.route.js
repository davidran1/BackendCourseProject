import e from "express";
import express from "express";
import { getUser } from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.get("/users/:id", getUser);

export default userRouter;
