import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getTransactions, createTransaction, getTransactionStats } from '../controllers/transaction.controller';

const router = Router();

router.use(authenticate);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.get('/stats', getTransactionStats);

export default router; 