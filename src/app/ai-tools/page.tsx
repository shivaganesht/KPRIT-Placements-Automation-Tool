'use client';

import React, { useState } from 'react';

interface Contact {
  name: string;
  position: string;
  company: string;
  email: string;
}

export default function AITools() {
  const [selectedTool, setSelectedTool] = useState<'email' | 'call' | 'linkedin'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState<'cold' | 'followup'>('cold');
  const [contactData, setContactData] = useState<Contact>({
    name: '',
    position: '',
    company: '',
    email: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [variables, setVariables] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  const handleGenerateContent = async () => {
    if (!contactData.name || !contactData.company) {
      alert('Please fill in at least the contact name and company');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let payload = { contactData };

      switch (selectedTool) {
        case 'email':
          endpoint = selectedTemplate === 'cold' ? '/api/ai/email/cold' : '/api/ai/email/followup';
          break;
        case 'call':
          endpoint = '/api/ai/call-script';
          payload = { contactData, scenario: 'initial' };
          break;
        case 'linkedin':
          endpoint = '/api/ai/linkedin';
          break;
      }

      console.log('Generating content for:', selectedTool, endpoint, payload);
      
      // Simulate API response
      setTimeout(() => {
        let content = '';
        
        if (selectedTool === 'email' && selectedTemplate === 'cold') {
          content = `Subject: Partnership Opportunity - KPRIT College Placements

Dear ${contactData.name},

I hope this email finds you well. My name is [AMBASSADOR_NAME], and I am a student ambassador at KPRIT College, representing our Training & Placement Cell.

I came across your profile as ${contactData.position} at ${contactData.company}, and I believe there could be a valuable partnership opportunity between ${contactData.company} and our institution.

KPRIT College is home to bright, motivated students in various engineering and technology disciplines. Our graduates have consistently demonstrated excellence in technical skills, problem-solving abilities, and adaptability to industry requirements.

We would love to explore how ${contactData.company} could benefit from recruiting our talented students. Our placement cell can facilitate campus recruitment drives, internship programs, and industry-academia partnerships.

Would you be available for a brief 15-minute call to discuss potential collaboration opportunities?

Best regards,
[AMBASSADOR_NAME]
KPRIT College - Student Ambassador
Training & Placement Cell`;
        } else if (selectedTool === 'email' && selectedTemplate === 'followup') {
          content = `Subject: Re: Partnership Opportunity - KPRIT College Placements

Dear ${contactData.name},

I hope you're doing well. I wanted to follow up on my previous email regarding a potential partnership between ${contactData.company} and KPRIT College.

Recent Placement Highlights:
• 95% placement rate in 2024
• Average package: ₹6.5 LPA
• Top package: ₹45 LPA
• 200+ companies recruited from our campus

Our students are skilled in cutting-edge technologies and are ready to contribute from day one. ${contactData.company}'s reputation for innovation makes it an ideal partner for our tech-savvy graduates.

Would any of these times work for a quick call?
• [TIME_SLOT_1]
• [TIME_SLOT_2]
• [TIME_SLOT_3]

Thank you for considering this opportunity.

Best regards,
[AMBASSADOR_NAME]`;
        } else if (selectedTool === 'call') {
          content = `COLD CALL SCRIPT - Initial Contact

OPENING (15 seconds):
"Hi ${contactData.name}, this is [AMBASSADOR_NAME] from KPRIT College. I hope I'm not catching you at a bad time?

PURPOSE (30 seconds):
"I'm calling because I noticed ${contactData.company} values innovation and talent, and I believe there's an exciting opportunity for us to discuss. I'm a student ambassador with our Training & Placement Cell, and we have some exceptional graduates who I think would be a great fit for ${contactData.company}.

QUESTION (Engagement):
"Are you currently looking to hire fresh graduates or interns for your team?"

KEY TALKING POINTS:
• 95% placement rate
• Students skilled in latest technologies
• Strong industry partnerships
• Flexible recruitment options

CLOSING:
"Thank you for your time, ${contactData.name}. I appreciate the opportunity to connect with you."`;
        } else if (selectedTool === 'linkedin') {
          content = `Hi ${contactData.name}, I'm [AMBASSADOR_NAME], a student ambassador at KPRIT College. I'd love to connect and explore potential collaboration opportunities between ${contactData.company} and our talented students. Our graduates have been making great contributions at top companies, and I believe ${contactData.company} could benefit from our talent pool. Would appreciate the opportunity to connect!`;
        }

        setGeneratedContent(content);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating content:', error);
      setLoading(false);
      alert('Error generating content');
    }
  };

  const handlePersonalize = () => {
    let personalizedContent = generatedContent;
    Object.keys(variables).forEach(key => {
      const placeholder = `[${key}]`;
      personalizedContent = personalizedContent.replace(new RegExp(placeholder, 'g'), variables[key]);
    });
    setGeneratedContent(personalizedContent);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                T&P Ambassador Tool - AI Tools
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/ai-tools" className="text-blue-600 font-medium">AI Tools</a>
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
            <h2 className="text-3xl font-bold text-gray-900">AI-Powered Outreach Tools</h2>
            <p className="mt-2 text-gray-600">
              Generate professional emails, call scripts, and LinkedIn messages with AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Tool Selection & Configuration */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Tool Type Selection */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Tool</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={selectedTool === 'email'}
                      onChange={(e) => setSelectedTool(e.target.value as 'email')}
                      className="mr-3"
                    />
                    <span>Email Template</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="call"
                      checked={selectedTool === 'call'}
                      onChange={(e) => setSelectedTool(e.target.value as 'call')}
                      className="mr-3"
                    />
                    <span>Call Script</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="linkedin"
                      checked={selectedTool === 'linkedin'}
                      onChange={(e) => setSelectedTool(e.target.value as 'linkedin')}
                      className="mr-3"
                    />
                    <span>LinkedIn Message</span>
                  </label>
                </div>

                {selectedTool === 'email' && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Email Type</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="cold"
                          checked={selectedTemplate === 'cold'}
                          onChange={(e) => setSelectedTemplate(e.target.value as 'cold')}
                          className="mr-3"
                        />
                        <span>Cold Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="followup"
                          checked={selectedTemplate === 'followup'}
                          onChange={(e) => setSelectedTemplate(e.target.value as 'followup')}
                          className="mr-3"
                        />
                        <span>Follow-up Email</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      value={contactData.name}
                      onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={contactData.position}
                      onChange={(e) => setContactData({...contactData, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="HR Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={contactData.company}
                      onChange={(e) => setContactData({...contactData, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Tech Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="john@techcorp.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateContent}
                  disabled={loading || !contactData.name || !contactData.company}
                  className="w-full mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Generating...' : 'Generate Content'}
                </button>
              </div>

              {/* Variable Replacement */}
              {generatedContent && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personalize Content</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AMBASSADOR_NAME
                      </label>
                      <input
                        type="text"
                        value={variables.AMBASSADOR_NAME || ''}
                        onChange={(e) => setVariables({...variables, AMBASSADOR_NAME: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AMBASSADOR_EMAIL
                      </label>
                      <input
                        type="email"
                        value={variables.AMBASSADOR_EMAIL || ''}
                        onChange={(e) => setVariables({...variables, AMBASSADOR_EMAIL: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="your.email@kprit.edu.in"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handlePersonalize}
                    className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
                  >
                    Apply Personalization
                  </button>
                </div>
              )}
            </div>

            {/* Generated Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Generated Content</h3>
                  {generatedContent && (
                    <button
                      onClick={copyToClipboard}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
                    >
                      Copy to Clipboard
                    </button>
                  )}
                </div>
                
                {generatedContent ? (
                  <div className="border border-gray-300 rounded-md p-4 min-h-96">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {generatedContent}
                    </pre>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-md p-4 min-h-96 flex items-center justify-center text-gray-500">
                    Select a tool and provide contact information to generate content
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}