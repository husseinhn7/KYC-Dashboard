import { User, Transaction, AuditLog, KYCCase } from '../types';

// Mock API service to simulate backend calls
class ApiService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock users data
  private mockUsers: Record<string, { user: User; token: string }> = {
    'admin@kyc.com': {
      user: {
        id: '1',
        email: 'admin@kyc.com',
        name: 'John Admin',
        role: 'Global Admin',
      },
      token: 'mock-jwt-token-admin',
    },
    'regional@kyc.com': {
      user: {
        id: '2',
        email: 'regional@kyc.com',
        name: 'Jane Regional',
        role: 'Regional Admin',
        region: 'North America',
      },
      token: 'mock-jwt-token-regional',
    },
    'sender@kyc.com': {
      user: {
        id: '3',
        email: 'sender@kyc.com',
        name: 'Mike Sender',
        role: 'Sending Partner',
      },
      token: 'mock-jwt-token-sender',
    },
    'receiver@kyc.com': {
      user: {
        id: '4',
        email: 'receiver@kyc.com',
        name: 'Sara Receiver',
        role: 'Receiving Partner',
      },
      token: 'mock-jwt-token-receiver',
    },
  };

  // Mock transactions data
  private mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      sender: 'Alice Johnson',
      receiver: 'Bob Smith',
      amount: 1500.00,
      currency: 'USD',
      status: 'completed',
      timestamp: '2024-01-20T10:30:00Z',
      region: 'North America',
      type: 'remittance',
    },
    {
      id: 'TXN-002',
      sender: 'Carlos Rodriguez',
      receiver: 'Maria Garcia',
      amount: 850.50,
      currency: 'USD',
      status: 'pending',
      timestamp: '2024-01-20T09:15:00Z',
      region: 'Latin America',
      type: 'remittance',
    },
    {
      id: 'TXN-003',
      sender: 'David Wilson',
      receiver: 'Emma Davis',
      amount: 2200.75,
      currency: 'USD',
      status: 'completed',
      timestamp: '2024-01-20T08:45:00Z',
      region: 'Europe',
      type: 'exchange',
    },
    {
      id: 'TXN-004',
      sender: 'Lisa Chen',
      receiver: 'James Brown',
      amount: 500.00,
      currency: 'USD',
      status: 'failed',
      timestamp: '2024-01-20T07:20:00Z',
      region: 'Asia Pacific',
      type: 'remittance',
    },
    {
      id: 'TXN-005',
      sender: 'Ahmed Hassan',
      receiver: 'Sophie Miller',
      amount: 3200.00,
      currency: 'USD',
      status: 'completed',
      timestamp: '2024-01-19T16:30:00Z',
      region: 'Middle East',
      type: 'settlement',
    },
  ];

  // Mock audit logs data
  private mockAuditLogs: AuditLog[] = [
    {
      id: 'LOG-001',
      user: 'john.admin@kyc.com',
      action: 'User Login',
      timestamp: '2024-01-20T10:45:00Z',
      status: 'success',
      details: 'Successful login from web interface',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      id: 'LOG-002',
      user: 'jane.regional@kyc.com',
      action: 'Transaction Approval',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'success',
      details: 'Approved transaction TXN-001 for $1,500.00',
      ipAddress: '192.168.1.101',
    },
    {
      id: 'LOG-003',
      user: 'mike.sender@kyc.com',
      action: 'Document Upload',
      timestamp: '2024-01-20T10:15:00Z',
      status: 'success',
      details: 'Uploaded compliance document for transaction TXN-002',
      ipAddress: '192.168.1.102',
    },
    {
      id: 'LOG-004',
      user: 'sara.receiver@kyc.com',
      action: 'Failed Login Attempt',
      timestamp: '2024-01-20T09:45:00Z',
      status: 'failed',
      details: 'Invalid password attempt',
      ipAddress: '192.168.1.103',
    },
    {
      id: 'LOG-005',
      user: 'system',
      action: 'Automated Compliance Check',
      timestamp: '2024-01-20T09:30:00Z',
      status: 'warning',
      details: 'High-risk transaction flagged for manual review',
      ipAddress: 'internal',
    },
  ];

  // Mock KYC cases data
  private mockKYCCases: KYCCase[] = [
    {
      id: 'KYC-001',
      userId: 'user-1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      userPhone: '+1-555-0123',
      region: 'North America',
      status: 'pending',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      documents: {
        idFront: '/placeholder-id-front.jpg',
        idBack: '/placeholder-id-back.jpg',
        proofOfAddress: '/placeholder-address.pdf'
      },
      notes: [
        {
          id: 'note-1',
          authorId: 'admin-1',
          authorName: 'Admin User',
          content: 'Initial submission received',
          timestamp: '2024-01-15T09:05:00Z',
          isInternal: true
        }
      ],
      assignedTo: 'admin@kyc.com'
    },
    {
      id: 'KYC-002',
      userId: 'user-2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      userPhone: '+1-555-0124',
      region: 'Europe',
      status: 'approved',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-15T08:45:00Z',
      documents: {
        idFront: '/placeholder-id-front.jpg',
        idBack: '/placeholder-id-back.jpg',
        proofOfAddress: '/placeholder-address.pdf'
      },
      notes: [],
      assignedTo: 'regional@kyc.com'
    },
    {
      id: 'KYC-003',
      userId: 'user-3',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      userPhone: '+1-555-0125',
      region: 'Asia Pacific',
      status: 'rejected',
      createdAt: '2024-01-13T11:15:00Z',
      updatedAt: '2024-01-14T16:20:00Z',
      documents: {
        idFront: '/placeholder-id-front.jpg'
      },
      notes: [
        {
          id: 'note-2',
          authorId: 'admin-2',
          authorName: 'Regional Admin',
          content: 'Missing proof of address document',
          timestamp: '2024-01-14T16:20:00Z',
          isInternal: false
        }
      ],
      assignedTo: 'regional@kyc.com'
    },
    {
      id: 'KYC-004',
      userId: 'user-4',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@example.com',
      userPhone: '+44-20-7946-0958',
      region: 'Europe',
      status: 'under_review',
      createdAt: '2024-01-16T12:30:00Z',
      updatedAt: '2024-01-16T14:15:00Z',
      documents: {
        idFront: '/placeholder-id-front.jpg',
        idBack: '/placeholder-id-back.jpg'
      },
      notes: [
        {
          id: 'note-3',
          authorId: 'admin-3',
          authorName: 'Compliance Officer',
          content: 'Document quality is borderline, requesting clearer images',
          timestamp: '2024-01-16T14:15:00Z',
          isInternal: true
        }
      ],
      assignedTo: 'regional@kyc.com'
    }
  ];

  async login(email: string, password: string) {
    await this.delay(800);
    
    const userData = this.mockUsers[email];
    if (userData && password === 'password123') {
      return userData;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  

  async getRates(from: string, to: string) {
    await this.delay(400);
    
    return {
      rate: 1.0,
      from,
      to,
      timestamp: new Date().toISOString(),
    };
  }

  async getTransactions() {
    await this.delay(600);
    
    return {
      transactions: this.mockTransactions,
      total: this.mockTransactions.length,
      page: 1,
      limit: 10,
    };
  }

  async getAuditLogs() {
    await this.delay(400);
    
    return {
      logs: this.mockAuditLogs,
      total: this.mockAuditLogs.length,
      page: 1,
      limit: 15,
    };
  }

  async getKYCCases() {
    await this.delay(500);
    
    return {
      cases: this.mockKYCCases,
      total: this.mockKYCCases.length,
      page: 1,
      limit: 10,
    };
  }

  async getKYCCase(id: string) {
    await this.delay(300);
    
    const kycCase = this.mockKYCCases.find(c => c.id === id);
    if (!kycCase) {
      throw new Error('KYC case not found');
    }
    
    return kycCase;
  }

  async updateKYCStatus(id: string, status: KYCCase['status'], reason?: string) {
    await this.delay(400);
    
    const caseIndex = this.mockKYCCases.findIndex(c => c.id === id);
    if (caseIndex === -1) {
      throw new Error('KYC case not found');
    }

    this.mockKYCCases[caseIndex] = {
      ...this.mockKYCCases[caseIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    if (reason) {
      this.mockKYCCases[caseIndex].notes.push({
        id: `note-${Date.now()}`,
        authorId: 'current-user',
        authorName: 'Current User',
        content: reason,
        timestamp: new Date().toISOString(),
        isInternal: false
      });
    }

    return this.mockKYCCases[caseIndex];
  }

  async addKYCNote(id: string, content: string, isInternal: boolean = true) {
    await this.delay(300);
    
    const caseIndex = this.mockKYCCases.findIndex(c => c.id === id);
    if (caseIndex === -1) {
      throw new Error('KYC case not found');
    }

    const newNote = {
      id: `note-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'Current User',
      content,
      timestamp: new Date().toISOString(),
      isInternal
    };

    this.mockKYCCases[caseIndex].notes.push(newNote);
    this.mockKYCCases[caseIndex].updatedAt = new Date().toISOString();

    return this.mockKYCCases[caseIndex];
  }
}

export const apiService = new ApiService();