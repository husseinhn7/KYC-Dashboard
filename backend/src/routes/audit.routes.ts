import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getAuditLogs } from '../controllers/audit.controller';

const router = Router();

router.use(authenticate);

router.get('/', getAuditLogs);

export default router; 