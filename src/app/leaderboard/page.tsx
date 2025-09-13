'use client';

import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  credits: number;
  approvedContacts: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // Placeholder for API call
      console.log('Fetching leaderboard...');
      
      // Simulate API response
      setTimeout(() => {
        setLeaderboard([
          { rank: 1, userId: '1', name: 'Alice Johnson', credits: 45, approvedContacts: 45 },
          { rank: 2, userId: '2', name: 'Bob Smith', credits: 38, approvedContacts: 38 },
          { rank: 3, userId: '3', name: 'Carol Davis', credits: 32, approvedContacts: 32 },
          { rank: 4, userId: '4', name: 'David Wilson', credits: 28, approvedContacts: 28 },
          { rank: 5, userId: '5', name: 'Eva Brown', credits: 24, approvedContacts: 24 },
          { rank: 6, userId: '6', name: 'Frank Miller', credits: 20, approvedContacts: 20 },
          { rank: 7, userId: '7', name: 'Grace Taylor', credits: 18, approvedContacts: 18 },
          { rank: 8, userId: '8', name: 'Henry Anderson', credits: 15, approvedContacts: 15 },
          { rank: 9, userId: '9', name: 'Ivy Thompson', credits: 12, approvedContacts: 12 },
          { rank: 10, userId: '10', name: 'Jack White', credits: 10, approvedContacts: 10 },
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank.toString();
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-gray-100 text-gray-800';
      case 3:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
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
              <a href="/leaderboard" className="text-blue-600 font-medium">Leaderboard</a>
              <a href="/stats" className="text-gray-700 hover:text-gray-900">Stats</a>
              <a href="/settings" className="text-gray-700 hover:text-gray-900">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Leaderboard</h2>
            <p className="mt-2 text-gray-600">
              Top ambassadors contributing to the T&P placement efforts
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Ambassadors</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">156</p>
              <p className="text-sm text-gray-500 mt-1">Active this month</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Contacts</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">1,247</p>
              <p className="text-sm text-gray-500 mt-1">HR contacts collected</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Companies Reached</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">89</p>
              <p className="text-sm text-gray-500 mt-1">Unique companies</p>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Top Contributors
              </h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ambassador
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approved Contacts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Achievement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry) => (
                      <tr key={entry.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${getRankColor(entry.rank)}`}>
                              {getRankBadge(entry.rank)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {entry.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {entry.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Ambassador #{entry.userId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-600">
                            {entry.credits}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {entry.approvedContacts}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.rank <= 3 
                              ? 'bg-green-100 text-green-800' 
                              : entry.rank <= 10 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.rank <= 3 ? 'Top Performer' : entry.rank <= 10 ? 'High Achiever' : 'Contributor'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Motivational Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Keep Contributing!</h3>
            <p className="text-blue-100">
              Every HR contact you find helps bring new opportunities to KPRIT students. 
              Climb the leaderboard and become a top contributor!
            </p>
            <div className="mt-4">
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Find More Contacts
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}