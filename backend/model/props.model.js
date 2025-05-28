import mongoose from 'mongoose';


const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true , unique: true},
  location: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  beds: { type: Number, required: false },
  baths: { type: Number, required: false },
  plotElitePrice: { type: Number, required: true },
  plotPremiumPrice: { type: Number, required: false },
  sqft: { type: Number, required: true },
  image: { type: String,  default: "" },
  mobileImage: { type: String,  default: "" },  
  propimage: { type: Array,  default: "" },
  featured: { type: Boolean, default: false },
  forSale: { type: Boolean, default: true },
  reraID: { type: String, default: true },
  type: { type: String, enum: ['house', 'apartment', 'condo', 'townhouse', 'villa','plots'], required: true },
  projectArea:{ type: String, required: true },
  totalPlots:{ type: Number, required: true },
  approved:{ type: Boolean, required: true },
  mapSrc:{ type: String, required: true },
  schools:{ type: Array, required: false, unique: true },
  highlight:{ type: Array, required: false},
  college:{ type: Array, required: false },
  transit:{ type: Array, required: false },
  hospital:{ type: Array, required: false },
  restaurants:{ type: Array, required: false },
  youtubelink:{ type: String, required: false },
  residential:{ type: Boolean, required: true },
  createdAt:{type:Date, default:() => Date.now(), immutable:true},
  updatedAt:{type:Date, default:() => Date.now()}
}); 

const Props = mongoose.model('Props', PropertySchema);
export default Props;