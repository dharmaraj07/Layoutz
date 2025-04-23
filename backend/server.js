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
import cors from 'cors'



dotenv.config();
const app = express();
const port = process.env.PORT;


app.use(cors({
  origin: "http://localhost:8080",
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





// Start the server after successfully connecting to the database

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connectDB();
  });

