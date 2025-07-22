import mongoose, { Document, Schema, Types } from 'mongoose';

export type KYCStatus = 'pending' | 'approved' | 'rejected';

export interface IKYCVerification extends Document {
  user: Types.ObjectId;
  status: KYCStatus;
  region: string;
  documents: {
    id_front: string;
    id_back: string;
    proof_of_address: string;
  };
  notes?: string[];
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KYCVerificationSchema = new Schema<IKYCVerification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  region: { type: String, required: true },
  documents: {
    id_front: { type: String, required: true },
    id_back: { type: String, required: true },
    proof_of_address: { type: String, required: true },
  },
  reason: { type: String, default: '' },
  notes: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IKYCVerification>('KYCVerification', KYCVerificationSchema); 