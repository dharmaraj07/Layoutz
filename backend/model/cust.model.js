import mongoose from 'mongoose';


const CustomerSchema = new mongoose.Schema({
  img: { type: String,  unique: true},
  name: { type: String, required: true },
  job: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number,  default: "" },
  videolink: { type: String, default: false },
  createdAt:{type:Date, default:() => Date.now(), immutable:true},
  updatedAt:{type:Date, default:() => Date.now()}
}); 

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;