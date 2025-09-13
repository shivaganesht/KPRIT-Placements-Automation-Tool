'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '../../components/ui/Navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isAdminUser } from '../../lib/auth';
import { useRouter } from 'next/navigation';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  position: string;
  linkedin_url?: string;
  source: 'signalhire' | 'apollo' | 'manual' | 'linkedin';
  relevance_score: number;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPanel() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [pendingContacts, setPendingContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Check authentication and admin access
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (!isAdminUser(user.email || '')) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isAdminUser(user.email || '')) {
      fetchPendingContacts();
    }
  }, [user]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (!user || !isAdminUser(user.email || '')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
            <p className="text-sm text-gray-500">Only authorized administrators can view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const fetchPendingContacts = async () => {
    try {
      setContactsLoading(true);
      // Placeholder for API call
      console.log('Fetching pending contacts...');
      
      // Simulate API response
      setTimeout(() => {
        setPendingContacts([
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@techcorp.com',
            phone: '+1-555-0123',
            company: 'TechCorp Solutions',
            position: 'Senior HR Manager',
            linkedin_url: 'https://linkedin.com/in/sarahjohnson',
            source: 'manual',
            relevance_score: 9,
            submitted_by: 'user123',
            status: 'pending',
            created_at: '2025-09-13T10:30:00Z',
            updated_at: '2025-09-13T10:30:00Z'
          },
          {
            id: '2',
            name: 'Michael Chen',
            email: 'mchen@innovativetech.com',
            phone: '+1-555-0124',
            company: 'Innovative Technologies',
            position: 'Talent Acquisition Lead',
            linkedin_url: 'https://linkedin.com/in/michaelchen',
            source: 'linkedin',
            relevance_score: 8,
            submitted_by: 'user456',
            status: 'pending',
            created_at: '2025-09-13T09:15:00Z',
            updated_at: '2025-09-13T09:15:00Z'
          },
          {
            id: '3',
            name: 'Emily Rodriguez',
            email: 'emily.r@startupinc.com',
            company: 'StartupInc',
            position: 'People Operations Manager',
            source: 'manual',
            relevance_score: 7,
            submitted_by: 'user789',
            status: 'pending',
            created_at: '2025-09-13T08:45:00Z',
            updated_at: '2025-09-13T08:45:00Z'
          }
        ]);
        setContactsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching pending contacts:', error);
      setContactsLoading(false);
    }
  };

  const handleApprove = async (contactId: string) => {
    try {
      console.log('Approving contact:', contactId, 'Notes:', adminNotes);
      // Placeholder for API call
      
      // Update local state
      setPendingContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSelectedContact(null);
      setAdminNotes('');
      
      alert('Contact approved successfully!');
    } catch (error) {
      console.error('Error approving contact:', error);
      alert('Error approving contact');
    }
  };

  const handleReject = async (contactId: string) => {
    try {
      console.log('Rejecting contact:', contactId, 'Notes:', adminNotes);
      // Placeholder for API call
      
      // Update local state
      setPendingContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSelectedContact(null);
      setAdminNotes('');
      
      alert('Contact rejected.');
    } catch (error) {
      console.error('Error rejecting contact:', error);
      alert('Error rejecting contact');
    }
  };

  const getSourceBadge = (source: string) => {
    const colors = {
      signalhire: 'bg-blue-100 text-blue-800',
      apollo: 'bg-purple-100 text-purple-800',
      linkedin: 'bg-blue-100 text-blue-800',
      manual: 'bg-gray-100 text-gray-800'
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                T&P Admin Panel
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/admin" className="text-blue-600 font-medium">Admin Panel</a>
              <a href="/leaderboard" className="text-gray-700 hover:text-gray-900">Leaderboard</a>
              <a href="/settings" className="text-gray-700 hover:text-gray-900">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Contact Approval Queue</h2>
            <p className="mt-2 text-gray-600">
              Review and approve HR contacts submitted by ambassadors
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingContacts.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Approved Today</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">12</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Rejected Today</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">3</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Processed</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">247</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contacts List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Pending Contacts ({pendingContacts.length})
                  </h3>
                </div>
                
                {contactsLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading contacts...</p>
                  </div>
                ) : pendingContacts.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No pending contacts to review</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {pendingContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`p-6 hover:bg-gray-50 cursor-pointer ${
                          selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedContact(contact)}
                      >
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
                            <div className="mt-2 flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceBadge(contact.source)}`}>
                                {contact.source}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Score: {contact.relevance_score}/10
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Submitted {formatDate(contact.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details & Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Details
                </h3>
                
                {selectedContact ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedContact.name}</h4>
                      <p className="text-sm text-gray-600">{selectedContact.position}</p>
                      <p className="text-sm text-gray-600">{selectedContact.company}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email:</p>
                      <p className="text-sm text-gray-600">{selectedContact.email}</p>
                    </div>
                    
                    {selectedContact.phone && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Phone:</p>
                        <p className="text-sm text-gray-600">{selectedContact.phone}</p>
                      </div>
                    )}
                    
                    {selectedContact.linkedin_url && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">LinkedIn:</p>
                        <a 
                          href={selectedContact.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Source:</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceBadge(selectedContact.source)}`}>
                        {selectedContact.source}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Relevance Score:</p>
                      <p className="text-sm text-gray-600">{selectedContact.relevance_score}/10</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Add notes about this contact..."
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(selectedContact.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(selectedContact.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Select a contact to view details and take action</p>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}