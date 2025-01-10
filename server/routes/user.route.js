import express from "express";
import { addUser, getUser } from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.get("/users/:id", getUser);
userRouter.post("/users/addUser", addUser);

export default userRouter;
