import express from 'express';
import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  assignEnquiryToAgent
} from '../controllers/agent.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/', protectRoute, getAgents);
router.get('/:id', protectRoute, getAgentById);
router.post('/', protectRoute, createAgent);
router.put('/:id', protectRoute, updateAgent);
router.delete('/:id', protectRoute, deleteAgent);
router.post('/assign', protectRoute, assignEnquiryToAgent);

export default router;
