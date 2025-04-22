import mongoose from 'mongoose';


const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true , unique: true},
  image: { type: Array,  default: "" },
  mobileImage: { type: Array,  default: "" },
  type: { type: String, enum: ['main', 'investment'], required: true },
  link:{ type: String, required: true },
  createdAt:{type:Date, default:() => Date.now(), immutable:true},
  updatedAt:{type:Date, default:() => Date.now()}
}); 

const Hero = mongoose.model('Hero', HeroSchema);
export default Hero;