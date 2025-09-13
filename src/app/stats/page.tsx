'use client';

// Statistics page for T&P Cell Ambassador Tool
import Navigation from '../../components/ui/Navigation';
import { useUserStats } from '../../hooks/useApi';

export default function StatsPage() {
  const { stats: userStats, loading, error } = useUserStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">{/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics & Analytics</h1>
          <p className="text-gray-600">Comprehensive overview of T&P Cell Ambassador program performance</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-3xl font-bold text-blue-600">{userStats?.totalContacts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">↗ +12.3%</span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Contacts</p>
                <p className="text-3xl font-bold text-green-600">{userStats?.totalContacts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">↗ +8.7%</span>
              <span className="text-gray-500 text-sm ml-1">approval rate: 71.5%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Ambassadors</p>
                <p className="text-3xl font-bold text-purple-600">156</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">↗ +5.2%</span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                <p className="text-3xl font-bold text-orange-600">{userStats?.credits || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">🏆</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">↗ +15.8%</span>
              <span className="text-gray-500 text-sm ml-1">total distributed</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Submission Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">📈 Chart Placeholder</p>
                <p className="text-sm text-gray-400">Line chart showing daily/weekly submissions</p>
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">🥧 Chart Placeholder</p>
                <p className="text-sm text-gray-400">Pie chart showing contacts by department</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers This Month</h3>
            <div className="space-y-4">
              {[
                { name: "Rahul Sharma", dept: "CSE", contacts: 45, credits: 1350 },
                { name: "Priya Patel", dept: "ECE", contacts: 38, credits: 1140 },
                { name: "Amit Kumar", dept: "MECH", contacts: 32, credits: 960 },
                { name: "Sneha Reddy", dept: "IT", contacts: 29, credits: 870 },
                { name: "Vijay Singh", dept: "CSE", contacts: 27, credits: 810 }
              ].map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-500">{performer.dept} Department</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{performer.contacts} contacts</p>
                    <p className="text-sm text-green-600">{performer.credits} credits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "New contact approved", user: "Rahul Sharma", time: "2 minutes ago", type: "approval" },
                { action: "Contact submitted", user: "Priya Patel", time: "15 minutes ago", type: "submission" },
                { action: "Credits awarded", user: "Amit Kumar", time: "1 hour ago", type: "reward" },
                { action: "Contact rejected", user: "Sneha Reddy", time: "2 hours ago", type: "rejection" },
                { action: "New ambassador joined", user: "Vijay Singh", time: "3 hours ago", type: "join" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'approval' ? 'bg-green-500' :
                    activity.type === 'submission' ? 'bg-blue-500' :
                    activity.type === 'reward' ? 'bg-orange-500' :
                    activity.type === 'rejection' ? 'bg-red-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📊</span>
                <p className="font-medium text-gray-900">Export Statistics</p>
                <p className="text-sm text-gray-500">Download CSV report</p>
              </div>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📋</span>
                <p className="font-medium text-gray-900">Contact List</p>
                <p className="text-sm text-gray-500">Export all contacts</p>
              </div>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">🏆</span>
                <p className="font-medium text-gray-900">Leaderboard</p>
                <p className="text-sm text-gray-500">Download rankings</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}