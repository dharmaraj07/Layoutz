import Agent from '../model/agent.model.js';
import Enq from '../model/enq.model.js';

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    
    // Get enquiry counts for each agent
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const enquiries = await Enq.find({ assignedAgent: agent._id }).populate('assignedAgent');
        const totalEnquiries = enquiries.length;
        const convertedEnquiries = enquiries.filter(e => e.status === 'converted').length;
        const activeEnquiries = enquiries.filter(e => e.status !== 'converted' && e.status !== 'lost').length;
        
        return {
          ...agent.toObject(),
          stats: {
            totalEnquiries,
            convertedEnquiries,
            activeEnquiries,
            enquiries: enquiries
          }
        };
      })
    );
    
    res.status(200).json(agentsWithStats);
  } catch (error) {
    console.error('Error in getAgents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const enquiries = await Enq.find({ assignedAgent: agent._id });
    
    res.status(200).json({ ...agent.toObject(), enquiries });
  } catch (error) {
    console.error('Error in getAgentById:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createAgent = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    
    // Convert empty string to null for unique index to work with sparse option
    const agentEmail = email && email.trim() !== '' ? email : null;
    
    if (agentEmail) {
      const existingAgent = await Agent.findOne({ email: agentEmail });
      if (existingAgent) {
        return res.status(400).json({ error: 'Agent with this email already exists' });
      }
    }
    
    const newAgent = new Agent({ name, email: agentEmail, phone, avatar });
    await newAgent.save();
    
    res.status(201).json(newAgent);
  } catch (error) {
    console.error('Error in createAgent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Convert empty string to null for unique index to work with sparse option
    if ('email' in updates) {
      updates.email = updates.email && updates.email.trim() !== '' ? updates.email : null;
    }
    
    const agent = await Agent.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.status(200).json(agent);
  } catch (error) {
    console.error('Error in updateAgent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if agent has assigned enquiries
    const enquiriesCount = await Enq.countDocuments({ assignedAgent: id });
    if (enquiriesCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete agent with assigned enquiries. Please reassign them first.' 
      });
    }
    
    const agent = await Agent.findByIdAndDelete(id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAgent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const assignEnquiryToAgent = async (req, res) => {
  try {
    const { enquiryId, agentId } = req.body;
    
    const enquiry = await Enq.findByIdAndUpdate(
      enquiryId,
      { assignedAgent: agentId },
      { new: true }
    ).populate('assignedAgent');
    
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    
    res.status(200).json(enquiry);
  } catch (error) {
    console.error('Error in assignEnquiryToAgent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
