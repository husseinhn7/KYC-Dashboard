import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'global_admin' | 'regional_admin' | 'sending_partner' | 'receiving_partner';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  region?: string;
  phone?: string; // optional field for phone number
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['global_admin', 'regional_admin', 'sending_partner', 'receiving_partner'], required: true },
  region: { type: String },
  phone: { type: String, default: null }, 
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema); 