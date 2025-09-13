export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ambassador' | 'admin';
  credits: number;
  teamRole: 'troopers' | 'cold_outreach' | 'outreach' | null;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  position: string;
  linkedinUrl?: string;
  source: 'signalhire' | 'apollo' | 'manual' | 'linkedin';
  relevanceScore: number;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  credits: number;
  approvedContacts: number;
}

export interface AITemplate {
  id: string;
  type: 'email' | 'call_script';
  title: string;
  content: string;
  variables: string[];
  createdAt: string;
}

export interface Stats {
  totalContacts: number;
  approvedContacts: number;
  pendingContacts: number;
  rejectedContacts: number;
  totalCredits: number;
  userRank: number;
}

export interface SearchFilters {
  company?: string;
  position?: string;
  source?: Contact['source'];
  relevanceScore?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: User['teamRole'];
  credits: number;
  joinedAt: string;
}