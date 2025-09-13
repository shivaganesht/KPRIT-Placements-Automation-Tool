'use client';

import React, { useState, useEffect } from 'react';
import { useUserStats, useHRSearch, useContactSubmission } from '../../hooks/useApi';
import Navigation, { QuickNav } from '../../components/ui/Navigation';

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

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'hr' | 'company'>('company');
  const [results, setResults] = useState<Contact[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  // API hooks
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useUserStats();
  const { searchContacts, loading: searchLoading, error: searchError } = useHRSearch();
  const { submitContact, loading: submitLoading, error: submitError } = useContactSubmission();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const searchResult = await searchContacts(searchQuery);
      if (searchResult?.results) {
        setResults(searchResult.results);
        // Update stats to reflect new credit balance
        refetchStats();
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };

  const addToList = async (contact: Contact) => {
    try {
      const message = `Found ${contact.name} (${contact.position}) at ${contact.company}. Email: ${contact.email}${contact.linkedin ? `, LinkedIn: ${contact.linkedin}` : ''}`;
      
      await submitContact(contact.id, message, 'email');
      
      setShowSuccessMessage(`${contact.name} has been added to your list and submitted for review!`);
      
      // Refresh stats
      refetchStats();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation title="T&P Ambassador Tool" />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome, Ambassador!</h2>
            <p className="mt-2 text-gray-600">
              Find HR contacts and help bring companies to KPRIT campus
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Search for HR Contacts
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4">
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
                  <option value="company">Company</option>
                  <option value="hr">HR Name</option>
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

            {/* Error Messages */}
            {searchError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {searchError}
              </div>
            )}

            {/* Success Messages */}
            {showSuccessMessage && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {showSuccessMessage}
              </div>
            )}
          </div>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow">
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
                        <p className="text-sm text-gray-500">
                          📍 {contact.location} • {contact.experience}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            contact.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {contact.verified ? '✓ Verified' : 'Unverified'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contact.source}
                          </span>
                        </div>
                        {contact.linkedin && (
                          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" 
                             className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block">
                            View LinkedIn Profile →
                          </a>
                        )}
                      </div>
                      
                      <button
                        onClick={() => addToList(contact)}
                        disabled={submitLoading}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {submitLoading ? 'Adding...' : 'Add to List'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Your Credits</h3>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mt-2"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.credits || 0}</p>
                  <p className="text-sm text-gray-500 mt-1">Credits available for searches</p>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Contacts</h3>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mt-2"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats?.totalContacts || 0}</p>
                  <p className="text-sm text-gray-500 mt-1">Contacts submitted for review</p>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Your Rank</h3>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mt-2"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-purple-600 mt-2">#{stats?.rank || '--'}</p>
                  <p className="text-sm text-gray-500 mt-1">On the leaderboard</p>
                </>
              )}
            </div>
          </div>

        </div>
      </main>
      
      <QuickNav showHome={false} />
    </div>
  );
}