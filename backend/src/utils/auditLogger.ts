import AuditLog, { AuditStatus } from '../models/audit.model';
import { Types } from 'mongoose';

export const logAudit = async (
  userId: Types.ObjectId,
  action: string,
  status: AuditStatus
) => {
  try {
    await AuditLog.create({ user: userId, action, status });
  } catch (err) {
    // Do not log PII or sensitive info
    console.error('Audit log error');
  }
}; 