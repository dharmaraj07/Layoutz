import mongoose from 'mongoose';


const CustomerSchema = new mongoose.Schema({
  img: { type: String, required: false},
  name: { type: String, required: true },
  job: { type: String, required: false },
  review: { type: String, required: false },
  rating: { type: Number,  default: "" },
  videolink: { type: String, default: false },
  createdAt:{type:Date, default:() => Date.now(), immutable:true},
  updatedAt:{type:Date, default:() => Date.now()},
  phone:{ type: String, required: true, unique:true },
  location:{ type: String, required: true },
  property:{ type: String, required: false },
  plotNum:{ type: String, required: false },
  custType:{ type: String, enum:['enquiry' , 'purchase' , 'justvisit'],required: true},
  visitDate:{type:Date,required: true},
  nextVisitDate:{type:Date, required: false}
}); 

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;