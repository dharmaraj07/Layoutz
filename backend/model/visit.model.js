import mongoose from 'mongoose';


const VisitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  property: { type: String,  default: "" },
  visitdate : { type:Date, default:() => Date.now()},
  people : { type: Number, default: false },
  status: { type: String, default: false },
  createdAt:{type:Date, default:() => Date.now(), immutable:true},
  updatedAt:{type:Date, default:() => Date.now()}
}); 

const Visit = mongoose.model('Visit', VisitSchema);
export default Visit;