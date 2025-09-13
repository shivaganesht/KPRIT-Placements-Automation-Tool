'use client';

import React, { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'hr' | 'company'>('hr');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Placeholder for actual API call
      console.log('Searching for:', searchQuery, 'Type:', searchType);
      // Simulate API response
      setTimeout(() => {
        setResults([
          {
            id: '1',
            name: 'John Doe',
            position: 'HR Manager',
            company: 'Tech Corp',
            email: 'john.doe@techcorp.com',
            relevanceScore: 8
          },
          {
            id: '2',
            name: 'Jane Smith',
            position: 'Talent Acquisition Specialist',
            company: 'Innovation Inc',
            email: 'jane.smith@innovation.com',
            relevanceScore: 9
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
    }
  };

  const addToList = (contact: any) => {
    console.log('Adding contact to list:', contact);
    // Placeholder for API call to submit contact for approval
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                T&P Ambassador Tool
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/leaderboard" className="text-gray-700 hover:text-gray-900">Leaderboard</a>
              <a href="/stats" className="text-gray-700 hover:text-gray-900">Stats</a>
              <a href="/settings" className="text-gray-700 hover:text-gray-900">Settings</a>
            </nav>
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
                  <option value="hr">HR Name</option>
                  <option value="company">Company</option>
                </select>
                
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
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
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Relevance Score: {contact.relevanceScore}/10
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addToList(contact)}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Add to List
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
              <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
              <p className="text-sm text-gray-500 mt-1">Total approved contacts</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">3</p>
              <p className="text-sm text-gray-500 mt-1">Contacts waiting for approval</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Your Rank</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">#5</p>
              <p className="text-sm text-gray-500 mt-1">On the leaderboard</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}