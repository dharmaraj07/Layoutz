import mongoose from 'mongoose';


// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error}`);
    process.exit(1);
  }};

  export default connectDB;
