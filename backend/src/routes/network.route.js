import express from 'express';
import { getParent, getDownline } from '../controllers/network.controller.js';
import { protectedUser } from '../middleware/user.middleware.js';

const router = express.Router();

// Both routes must be protected. A user should only see their own network information.
router.get('/parent', protectedUser, getParent);
router.get('/downline', protectedUser, getDownline);

export default router;
