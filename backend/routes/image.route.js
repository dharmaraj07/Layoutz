import express from 'express';

import {hero, getHero, deleteHero,updateHero} from '../controllers/image.controller.js'

const router = express.Router();

router.post("/heros", hero)
router.put("/heros", hero)
router.get("/getHero", getHero)
router.get("/deleteHero/:id", deleteHero)
router.put("/updateHero/:id", updateHero)



export default router;