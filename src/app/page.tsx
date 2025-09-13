'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navigation from '../components/ui/Navigation';
import { useUserStats, useHRSearch } from '../hooks/useApi';

interface HRContact {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
  linkedin?: string;
  notes?: string;
  relevanceScore?: number;
}

interface UserStats {
  totalSubmissions: number;
  approvedContacts: number;
  pendingReview: number;
  rank: number;
  credits: number;
}

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'hr' | 'company'>('hr');
  const [results, setResults] = useState<HRContact[]>([]);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const router = useRouter();

  // Use API hooks
  const { stats: userStats, loading: statsLoading, refetch: refetchStats } = useUserStats();
  const { searchContacts, loading: searchLoading } = useHRSearch();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;

    try {
      const result = await searchContacts(searchQuery, {
        searchType: searchType
      });
      
      if (result?.results) {
        setResults(result.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };

  const handleSubmitContact = async (contact: HRContact) => {
    if (!user || submitting) return;

    setSubmitting(contact.id);
    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:3001/api/hr/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: contact.name,
          position: contact.position,
          company: contact.company,
          email: contact.email,
          phone: contact.phone,
          linkedin: contact.linkedin,
          notes: contact.notes
        })
      });

      if (response.ok) {
        alert('Contact submitted successfully for admin review!');
        // Refresh user stats
        refetchStats();
        // Remove from search results
        setResults(prev => prev.filter(c => c.id !== contact.id));
      } else {
        const error = await response.text();
        alert(`Failed to submit contact: ${error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit contact. Please try again.');
    } finally {
      setSubmitting(null);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                T&P Ambassador Tool
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.displayName || user.email}
              </span>
              <nav className="flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
                <a href="/leaderboard" className="text-gray-700 hover:text-gray-900">Leaderboard</a>
                <a href="/ai-tools" className="text-gray-700 hover:text-gray-900">AI Tools</a>
                <a href="/stats" className="text-gray-700 hover:text-gray-900">Stats</a>
                <a href="/settings" className="text-gray-700 hover:text-gray-900">Settings</a>
                {user.email?.endsWith('@kpritech.ac.in') && (
                  <a href="/admin" className="text-blue-700 hover:text-blue-900 font-medium">Admin</a>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome, Ambassador!</h2>
            <p className="mt-2 text-gray-600">
              Find HR contacts and help bring companies to KPRIT campus
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800 text-sm">
                 <strong>How it works:</strong> Search for HR contacts, submit them for review, and earn credits. 
                Approved contacts help bring more companies to our campus!
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Search for HR Contacts
            </h3>

            <div className="flex flex-col md:flex-row gap-4 text-gray-700">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter HR name or Company name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'hr' | 'company')}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hr">HR Name</option>
                  <option value="company">Company</option>
                </select>

                <button
                  onClick={handleSearch}
                  disabled={searchLoading || !searchQuery.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Search Results ({results.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {results.map((contact) => (
                  <div key={contact.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {contact.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {contact.position} at {contact.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                           {contact.email}
                        </p>
                        {contact.phone && (
                          <p className="text-sm text-gray-500">
                             {contact.phone}
                          </p>
                        )}
                        {contact.linkedin && (
                          <p className="text-sm text-gray-500">
                             {contact.linkedin}
                          </p>
                        )}
                        {contact.relevanceScore && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Relevance Score: {contact.relevanceScore}/10
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleSubmitContact(contact)}
                        disabled={submitting === contact.id}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting === contact.id ? 'Submitting...' : 'Submit for Review'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Overview */}
          {userStats && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Your Credits</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{userStats.credits}</p>
                <p className="text-sm text-gray-500 mt-1">Total approved contacts</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{userStats.pendingContacts}</p>
                <p className="text-sm text-gray-500 mt-1">Contacts waiting for approval</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Your Rank</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">#{userStats.rank}</p>
                <p className="text-sm text-gray-500 mt-1">On the leaderboard</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Submissions</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">{userStats.totalContacts}</p>
                <p className="text-sm text-gray-500 mt-1">All time submissions</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/ai-tools"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl mb-2"></div>
                <h4 className="font-medium text-gray-900">AI Tools</h4>
                <p className="text-sm text-gray-600">Generate emails, LinkedIn messages, and more</p>
              </a>

              <a
                href="/leaderboard"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl mb-2"></div>
                <h4 className="font-medium text-gray-900">Leaderboard</h4>
                <p className="text-sm text-gray-600">See top performing ambassadors</p>
              </a>

              <a
                href="/stats"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl mb-2"></div>
                <h4 className="font-medium text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-600">View detailed statistics and trends</p>
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
