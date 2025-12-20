import express from 'express';

import {props, getProps, deleteProps,updateProps} from '../controllers/prop.controller.js'

const router = express.Router();

router.post("/props", props)
router.put("/props", props)
router.get("/getProps", getProps)
router.get("/deleteProps/:id", deleteProps)
router.put("/updateProps/:id", updateProps)



export default router;