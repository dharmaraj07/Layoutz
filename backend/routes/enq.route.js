import express from 'express';
import { deleteEnq, enq, getEnq, updateEnq } from '../controllers/enq.controller.js';

const router = express.Router();

router.post("/enqs", enq)
router.put("/enqs", enq)
router.get("/getEnq", getEnq)
router.get("/deleteEnq/:id", deleteEnq)
router.put("/updateEnq/:id", updateEnq)



export default router;