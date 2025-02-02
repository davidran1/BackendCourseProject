import express from "express";
import { addUser, getUser } from "../controllers/user.controller.js";

/**
* Express router instance for user routes
*/
const userRouter = express.Router();

/**
* Route to get user details by ID
*/
userRouter.get("/users/:id", getUser);

/**
* Route to add a new user - Not required for the project
*/
userRouter.post("/users/addUser", addUser);

export default userRouter;