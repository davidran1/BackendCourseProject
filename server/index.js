import express from 'express';

const app = express();

import costRouter from './routes/cost.route.js';
import userRouter from './routes/user.route.js';

//body paresr
app.use(express.json({limit:"50mb"}));

//cookie parser
//app.use(cookieParser());

app.use('/api', costRouter , userRouter);
const PORT = process.env.PORT||3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/about', (req, res) => { 
    res.send('Hello Project'); });


