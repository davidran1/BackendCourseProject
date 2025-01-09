import express from "express";
import { addCost, getCostReport } from "../controllers/cost.controller.js";
const costRouter = express.Router();

costRouter.post("/add", addCost);
costRouter.get("/report", getCostReport);

export default costRouter;
