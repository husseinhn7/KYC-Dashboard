import mongoose, { Document, Schema, Types } from 'mongoose';

export type AuditStatus = 'success' | 'failure';

export interface IAuditLog extends Document {
  user: Types.ObjectId;
  action: string;
  status: AuditStatus;
  timestamp: Date;
  details?: string;
  region: string;
}

const AuditLogSchema = new Schema<IAuditLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  region: { type: String, required: true },
  status: { type: String, enum: ['success', 'failure'], required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, default: '' },
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema); 