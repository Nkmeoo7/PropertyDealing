import express from 'express';
import { createTransaction } from '../controllers/transaction.controller.js';
import { protectedUser, authorize } from '../middleware/user.middleware.js';

const router = express.Router();

// A user must be logged in ('protect') and have the role of 'user' ('authorize') to buy.
router.post('/buy/:propertyId', protectedUser, authorize('user'), createTransaction);

export default router;
