import express from "express";
import { addCost, getCostReport } from "../controllers/cost.controller.js";
/**
* Express router instance for cost routes
*/
const costRouter = express.Router();
/**
* Route to add a new cost item
*/
costRouter.post("/add", addCost);
/**
 * Route to get a cost report
 */ 
costRouter.get("/report", getCostReport);

export default costRouter;
