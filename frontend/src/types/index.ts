// Shared types for the application
export type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  region?: string;
}

export interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  region?: string;
  type: 'remittance' | 'exchange' | 'settlement';
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface KYCCase {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  region: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  createdAt: string;
  updatedAt: string;
  documents: {
    idFront?: string;
    idBack?: string;
    proofOfAddress?: string;
  };
  notes: KYCNote[];
  assignedTo?: string;
}

export interface KYCNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}



export interface TransactionStatsResponse {
  totalAmount: number;
  totalTransactions: number;
  kycCount: number;
  kycPending: number;
  latestTransactions: PopulatedTransaction[];
}

export interface PopulatedTransaction {
  _id: string;
  sender: TransactionUser;
  receiver: TransactionUser;
  amount: number;
  currency: "USD" | "USDC";
  status: "completed" | "pending" | "failed";
  timestamp: string; // ISO date string
  region: string;
  __v?: number;
}

export interface TransactionUser {
  _id: string;
  name: string;
  email: string;
}


export interface KYCVerificationResponse {
  _id: string;
  user: KYCUser;
  status: "pending" | "approved" | "rejected" | "under_review";
  region: string;
  notes: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface KYCUser {
  _id: string;
  name: string;
  email: string;
}



export interface TransactionResponse {
  _id: string;
  sender: TransactionUser;
  receiver: TransactionUser;
  amount: number;
  currency: "USD" | "USDC";
  status: "completed" | "pending" | "failed";
  timestamp: string;  
  __v?: number;
  region?: string;  
}

export interface TransactionUser {
  _id: string;
  name: string;
  email: string;

}


export interface AuditLogResponse {
  _id: string;
  user: AuditUser;
  action: string;
  region: string;
  status: "success" | "failure";
  timestamp: string; // ISO string
  details: string;
}

export interface AuditUser {
  _id: string;
  name: string;
  email: string;
}


export interface KYCVerificationRaw {
  _id: string;
  user: {
    _id: string; // ObjectId as string
    name: string;
    email: string;
    phone: string;
    region: string;
  }; // ObjectId as string
  reason?: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  region: string;
  notes: string[];
  documents: {
    id_front: string;
    id_back: string;
    proof_of_address: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v?: number;
}



export enum Region {
  MENA = "MENA", // Middle East and North Africa
  EU = "EU", // European Union
  NA = "NA", // North America
  SA = "SA", // South America
  APAC = "APAC", // Asia-Pacific
  SSA = "SSA", // Sub-Saharan Africa
  GLOBAL = "GLOBAL", // For global admin or non-region-specific cases
}