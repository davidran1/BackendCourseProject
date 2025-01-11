import express from "express";

const app = express();

import costRouter from "./routes/cost.route.js";
import userRouter from "./routes/user.route.js";
import { connectDB } from "./utils/db.js";

//body paresr
app.use(express.json({ limit: "50mb" }));

//cookie parser
//app.use(cookieParser());

app.use("/api", costRouter, userRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/api/about", (req, res) => {
  res.status(200).json({
    success: true,
    team_members: {
      member1: {
        first_name: "david",
        last_name: "azran",
      },
      member2: {
        first_name: "ofir",
        last_name: "harar",
      },
    },
  });
});
