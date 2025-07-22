import mongoose, { Document, Schema, Types } from 'mongoose';

export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionCurrency = 'USD' | 'USDC';

export interface ITransaction extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  amount: number;
  currency: TransactionCurrency;
  status: TransactionStatus;
  timestamp: Date;
  region: string;
}

const TransactionSchema = new Schema<ITransaction>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'USDC'], required: true },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'pending' },
  region: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema); 