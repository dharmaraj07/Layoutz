import express from 'express';

import { cust, deleteCust, getCust, updateCust } from '../controllers/cust.controller.js';

const router = express.Router();

router.post("/", cust)
router.get("/getcust", getCust)
router.get("/deleteCust/:id", deleteCust)
router.put("/updateCust/:id", updateCust)

export default router;