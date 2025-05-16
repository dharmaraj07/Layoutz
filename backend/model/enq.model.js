import mongoose from 'mongoose';


const EnqSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  property: { type: String,  default: "" },
  review:{ type: String, default: false },
  invest:{ type: Boolean, default: false },
  visitDate:{type:Date, default:() => Date.now()},
  completed:{ type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt:{type:Date, default:() => Date.now(), immutable:true},

}); 

const Enq = mongoose.model('Enq', EnqSchema);
export default Enq;