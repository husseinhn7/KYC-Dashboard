import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import {
  getKycCases,
  getKycCase,
  approveOrRejectKycCase,
  addKycNote
} from '../controllers/kyc.controller';

const router = Router();

router.use(authenticate);

router.get('/', getKycCases);
router.get('/:id', getKycCase);
router.patch('/:id', authorize(['global_admin', 'regional_admin']), approveOrRejectKycCase);
router.post('/:id/note', authorize(['global_admin', 'regional_admin']), addKycNote);

export default router; 