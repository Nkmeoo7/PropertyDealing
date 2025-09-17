import express from "express"
import { createProperty, deleteProperty, getAllProperty, getPropertyById, updateProperty } from "../controllers/property.controller.js";
import { protectedUser, authorize } from "../middleware/user.middleware.js"

const router = express.Router();


router.get("/", getAllProperty);
router.get("/:id", getPropertyById);

//proteced route
//
router.post("/", protectedUser, authorize('agent'), createProperty);
router.put("/:id", protectedUser, authorize('agent'), updateProperty);
router.delete("/:id", protectedUser, authorize('agent'), deleteProperty);


export default router;

