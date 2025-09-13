'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingData {
  step: number;
  team: string;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    year: string;
    branch: string;
  };
  collegeDetails: {
    rollNumber: string;
    section: string;
    cgpa: string;
  };
  preferences: {
    notifications: boolean;
    teamUpdates: boolean;
    achievements: boolean;
  };
}

const teams = [
  {
    id: 'trooper',
    name: 'Troopers',
    description: 'Core team members who lead initiatives and coordinate activities',
    icon: '⭐',
    perks: ['Leadership opportunities', 'Direct coordination', 'High impact projects']
  },
  {
    id: 'cold-outreach',
    name: 'Cold Outreach Team',
    description: 'Specialists in finding and contacting HR professionals',
    icon: '🎯',
    perks: ['Contact research', 'Email templates', 'Higher credit rewards']
  },
  {
    id: 'outreach',
    name: 'Outreach Team',
    description: 'Focus on building relationships and maintaining connections',
    icon: '🤝',
    perks: ['Relationship building', 'Follow-up strategies', 'Network expansion']
  }
];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const branches = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    step: 1,
    team: '',
    personalDetails: {
      name: '',
      email: '',
      phone: '',
      year: '',
      branch: ''
    },
    collegeDetails: {
      rollNumber: '',
      section: '',
      cgpa: ''
    },
    preferences: {
      notifications: true,
      teamUpdates: true,
      achievements: true
    }
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTeamSelection = (teamId: string) => {
    setData(prev => ({ ...prev, team: teamId }));
  };

  const handlePersonalDetailsChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value }
    }));
  };

  const handleCollegeDetailsChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      collegeDetails: { ...prev.collegeDetails, [field]: value }
    }));
  };

  const handlePreferencesChange = (field: string, value: boolean) => {
    setData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const completeOnboarding = async () => {
    try {
      console.log('Completing onboarding with data:', data);
      // Here you would save the data to your backend
      // await saveOnboardingData(data);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.team !== '';
      case 2:
        return data.personalDetails.name && data.personalDetails.email && 
               data.personalDetails.phone && data.personalDetails.year && 
               data.personalDetails.branch;
      case 3:
        return data.collegeDetails.rollNumber && data.collegeDetails.section;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to T&P Ambassador Program!</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">Step {currentStep} of 4</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Team Selection */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Choose Your Team</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select the team that best matches your interests and skills
              </p>
              
              <div className="space-y-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamSelection(team.id)}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                      data.team === team.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl">{team.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{team.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{team.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {team.perks.map((perk, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                            >
                              {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Personal Details</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tell us about yourself
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={data.personalDetails.name}
                    onChange={(e) => handlePersonalDetailsChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={data.personalDetails.email}
                    onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="your.email@kpritech.ac.in"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={data.personalDetails.phone}
                    onChange={(e) => handlePersonalDetailsChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year *
                    </label>
                    <select
                      value={data.personalDetails.year}
                      onChange={(e) => handlePersonalDetailsChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Branch *
                    </label>
                    <select
                      value={data.personalDetails.branch}
                      onChange={(e) => handlePersonalDetailsChange('branch', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: College Details */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">College Details</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Additional information about your academic profile
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    value={data.collegeDetails.rollNumber}
                    onChange={(e) => handleCollegeDetailsChange('rollNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your roll number"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Section *
                    </label>
                    <input
                      type="text"
                      value={data.collegeDetails.section}
                      onChange={(e) => handleCollegeDetailsChange('section', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="A, B, C..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CGPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={data.collegeDetails.cgpa}
                      onChange={(e) => handleCollegeDetailsChange('cgpa', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="8.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Customize your experience
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about new opportunities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.preferences.notifications}
                      onChange={(e) => handlePreferencesChange('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Team Updates</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about team activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.preferences.teamUpdates}
                      onChange={(e) => handlePreferencesChange('teamUpdates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Achievement Celebrations</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Celebrate your milestones and achievements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.preferences.achievements}
                      onChange={(e) => handlePreferencesChange('achievements', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={completeOnboarding}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}