import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => Date.now(), immutable: true },
  updatedAt: { type: Date, default: () => Date.now() }
});

// Create a sparse unique index for email that allows multiple null values
AgentSchema.index({ email: 1 }, { unique: true, sparse: true });

const Agent = mongoose.model('Agent', AgentSchema);
export default Agent;
