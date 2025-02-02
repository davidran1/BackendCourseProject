import express from "express";

/**
* Main Express application 
*/
const app = express();

import costRouter from "./routes/cost.route.js";
import userRouter from "./routes/user.route.js";
import { connectDB } from "./utils/db.js";

// Middleware for request body parsing
// Limits request size to 50MB
app.use(express.json({ limit: "50mb" }));

/**
* Configure main API routes
* Combines cost and user routes under /api 
*/
app.use("/api", costRouter, userRouter);

/**
* Server port - taken from environment variables or defaults to 3000
*/
const PORT = process.env.PORT || 4000;

/**
* Start server and connect to database
*/
app.listen(PORT, () => {
 connectDB();
 console.log(`Server is running on http://localhost:${PORT}`);
});

/**
* Endpoint providing team member information
*/
app.get("/api/about", (req, res) => {
 res.status(200).json([{first_name: "David", last_name: "Azran"},{first_name: "Ofir", last_name: "Harar"}]);
});