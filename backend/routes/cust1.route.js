import express from 'express';

import { cust, deleteCust, getCust, updateCust,addBulkCust } from '../controllers/cust.controller.js';

const router = express.Router();

router.post("/", cust)
router.get("/getcust", getCust)
router.get("/deleteCust/:id", deleteCust)
router.put("/updateCust/:id", updateCust)
router.post("/addBulkCust", addBulkCust)

export default router;