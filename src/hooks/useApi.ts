import { useState, useEffect } from 'react';

interface UserStats {
  credits: number;
  totalContacts: number;
  pendingContacts: number;
  rank: number;
  email: string;
  name: string;
}

interface Contact {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  linkedin?: string;
  location: string;
  experience: string;
  verified: boolean;
  source: string;
  phone?: string;
  department: string;
}

interface SearchResult {
  success: boolean;
  results: Contact[];
  creditsRemaining: number;
  resultCount: number;
}

// Mock token for development - in production, get from Firebase Auth
const getMockToken = () => {
  return 'mock-token-' + Date.now();
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/user/stats`, {
        headers: {
          'Authorization': `Bearer ${getMockToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const data = await response.json();
      
      // Calculate pending contacts and rank (mock for now)
      const enhancedStats = {
        ...data,
        pendingContacts: Math.floor(Math.random() * 5) + 1,
        rank: Math.floor(Math.random() * 20) + 1
      };
      
      setStats(enhancedStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback data for development
      setStats({
        credits: 0,
        totalContacts: 0,
        pendingContacts: 0,
        rank: 0,
        email: 'student@kpritech.ac.in',
        name: 'Student Ambassador'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

export const useHRSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchContacts = async (company: string, filters: any = {}): Promise<SearchResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/hr/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getMockToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ company, filters })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const advancedSearch = async (searchParams: any): Promise<SearchResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/hr/advanced-search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getMockToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Advanced search failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Advanced search failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchContacts, advancedSearch, loading, error };
};

export const useContactSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = async (contactId: string, message: string, approach: string = 'email') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/contacts/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getMockToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hrId: contactId,
          message,
          approach
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit contact');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit contact';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitContact, loading, error };
};

export const useUserRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getMockToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
};

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${getMockToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      } else {
        setError('Failed to fetch leaderboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
};