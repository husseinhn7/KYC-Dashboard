import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const { from, to } = req.query;
  if (from === 'USD' && to === 'USDC') {
    return res.json({ rate: 1.0 });
  }
  res.status(400).json({ message: 'Unsupported currency pair' });
});

export default router; 