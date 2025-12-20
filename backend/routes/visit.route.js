import express from 'express';
import {visit, getVisit, deleteVisit,updateVisit} from '../controllers/visit.controller.js'

const router = express.Router();

router.post("/visits", visit)
router.put("/visit", visit)
router.get("/getVisit", getVisit)
router.get("/deleteVisit/:id", deleteVisit)
router.put("/updateVisit/:id", updateVisit)



export default router;