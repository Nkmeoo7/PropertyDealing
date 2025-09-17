import express from "express"
import router from "./auth.route";
import { getAllProperty, getPropertyById } from "../controllers/property.controller.js";


const router = express.Router();


router.get("/", getAllProperty);
router.get("/:id", getPropertyById);



export default router;

