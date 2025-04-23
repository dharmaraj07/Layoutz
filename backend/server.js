import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv  from 'dotenv';
import authRoute from './routes/auth.route.js';
import propRoute from './routes/prop.route.js';
import custRoute from './routes/cust1.route.js';
import connectDB from './db/connectDB.js';
import visitRoute from './routes/visit.route.js';
import enqRoute from './routes/enq.route.js';
import imageRoute from './routes/image.route.js';
import cors from 'cors';
import path from "path";



dotenv.config();
const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();


app.use(cors({
  origin: "https://layoutz-6.onrender.com",
  credentials:true

}))
app.use(cookieParser())
app.use(express.json())

app.use(express.urlencoded({
  extended: true
}));

  

app.use('/api/auth', authRoute)
app.use('/api/prop', propRoute)
app.use('/api/cust', custRoute)
app.use('/api/visit', visitRoute)
app.use('/api/enq', enqRoute)
app.use('/api/hero', imageRoute)

if (process.env.NODE_ENV === "production")
  app.use(express.static(path.join(__dirname,"dist")))
  app.use("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"dist","index.html"))
  })



// Start the server after successfully connecting to the database

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connectDB();
  });

