import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';
import path from 'path';

// Import routes (to be implemented)
import authRoutes from './routes/auth.routes';
import kycRoutes from './routes/kyc.routes';
import transactionRoutes from './routes/transaction.routes';
import auditRoutes from './routes/audit.routes';
import ratesRoutes from './routes/rates.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

dotenv.config();

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8080', "http://192.168.56.1:8080/"],
}));
app.use(express.json());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts, please try again later.'
});
app.use('/api/auth', authLimiter);

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../public')));

// Connect to DB
connectDB();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app; 