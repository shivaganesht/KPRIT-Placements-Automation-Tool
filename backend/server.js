const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin (with fallback for development)
let firebaseApp;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  } else {
    console.log('⚠️ Firebase Admin not configured - running in mock mode');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  console.log('⚠️ Running in mock mode');
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database file paths
const USERS_DB = path.join(__dirname, 'data', 'users.json');
const CONTACTS_DB = path.join(__dirname, 'data', 'contacts.json');
const CREDITS_DB = path.join(__dirname, 'data', 'credits.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  // Initialize empty files if they don't exist
  const files = [
    { path: USERS_DB, default: {} },
    { path: CONTACTS_DB, default: [] },
    { path: CREDITS_DB, default: {} }
  ];
  
  for (const file of files) {
    try {
      await fs.access(file.path);
    } catch {
      await fs.writeFile(file.path, JSON.stringify(file.default, null, 2));
    }
  }
}

// Helper functions for database operations
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Authentication middleware
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization token provided' });
    }

    const token = authHeader.substring(7);

    if (firebaseApp) {
      // Use Firebase Admin for real authentication
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0]
        };
      } catch (firebaseError) {
        console.error('Firebase token verification failed:', firebaseError);
        return res.status(401).json({ error: 'Invalid authentication token' });
      }
    } else {
      // Mock authentication for development
      console.log('🔓 Mock authentication mode');
      req.user = {
        uid: 'mock_user_' + Date.now(),
        email: 'mock@kpritech.ac.in',
        name: 'Mock User'
      };
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    firebase: !!firebaseApp 
  });
});

// User registration/login
app.post('/api/auth/register', authenticateUser, async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    
    const users = await readJsonFile(USERS_DB) || {};
    
    if (!users[uid]) {
      users[uid] = {
        email,
        name,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalContacts: 0,
        credits: 10 // Starting credits
      };
      
      await writeJsonFile(USERS_DB, users);
      
      // Initialize credits
      const credits = await readJsonFile(CREDITS_DB) || {};
      credits[uid] = 10;
      await writeJsonFile(CREDITS_DB, credits);
    } else {
      // Update last login
      users[uid].lastLogin = new Date().toISOString();
      await writeJsonFile(USERS_DB, users);
    }

    res.json({ 
      success: true, 
      user: users[uid],
      message: 'User registered/updated successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get user stats
app.get('/api/user/stats', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const users = await readJsonFile(USERS_DB) || {};
    const credits = await readJsonFile(CREDITS_DB) || {};
    
    const userStats = users[uid] || {
      email: req.user.email,
      name: req.user.name,
      totalContacts: 0,
      registeredAt: new Date().toISOString()
    };
    
    userStats.credits = credits[uid] || 0;
    
    res.json(userStats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

// HR Search endpoint
app.post('/api/hr/search', authenticateUser, async (req, res) => {
  try {
    const { company, filters } = req.body;
    const { uid } = req.user;
    
    if (!company) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Check user credits
    const credits = await readJsonFile(CREDITS_DB) || {};
    const userCredits = credits[uid] || 0;
    
    if (userCredits < 1) {
      return res.status(402).json({ error: 'Insufficient credits for HR search' });
    }

    // Mock HR search results (in production, this would be real data)
    const mockResults = [
      {
        id: 1,
        name: 'Sarah Johnson',
        position: 'HR Director',
        company: company,
        email: `sarah.johnson@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        linkedin: `https://linkedin.com/in/sarah-johnson-${company.toLowerCase()}`,
        location: 'Mumbai, Maharashtra',
        experience: '8+ years in HR',
        verified: true
      },
      {
        id: 2,
        name: 'Rajesh Kumar',
        position: 'Talent Acquisition Manager',
        company: company,
        email: `rajesh.kumar@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        linkedin: `https://linkedin.com/in/rajesh-kumar-${company.toLowerCase()}`,
        location: 'Bangalore, Karnataka',
        experience: '5+ years in recruitment',
        verified: true
      },
      {
        id: 3,
        name: 'Priya Sharma',
        position: 'HR Business Partner',
        company: company,
        email: `priya.sharma@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        linkedin: `https://linkedin.com/in/priya-sharma-${company.toLowerCase()}`,
        location: 'Delhi, India',
        experience: '6+ years in HR operations',
        verified: false
      }
    ];

    // Deduct credit
    credits[uid] = userCredits - 1;
    await writeJsonFile(CREDITS_DB, credits);

    res.json({
      success: true,
      results: mockResults,
      creditsRemaining: credits[uid],
      searchQuery: { company, filters }
    });

  } catch (error) {
    console.error('HR search error:', error);
    res.status(500).json({ error: 'HR search failed' });
  }
});

// Submit contact endpoint
app.post('/api/contacts/submit', authenticateUser, async (req, res) => {
  try {
    const { hrId, message, approach } = req.body;
    const { uid, email, name } = req.user;
    
    if (!hrId || !message) {
      return res.status(400).json({ error: 'HR ID and message are required' });
    }

    const contacts = await readJsonFile(CONTACTS_DB) || [];
    
    const contactEntry = {
      id: Date.now(),
      userId: uid,
      userEmail: email,
      userName: name,
      hrId,
      message,
      approach: approach || 'email',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    contacts.push(contactEntry);
    await writeJsonFile(CONTACTS_DB, contacts);

    // Update user stats
    const users = await readJsonFile(USERS_DB) || {};
    if (users[uid]) {
      users[uid].totalContacts = (users[uid].totalContacts || 0) + 1;
      await writeJsonFile(USERS_DB, users);
    }

    res.json({
      success: true,
      contact: contactEntry,
      message: 'Contact submitted successfully'
    });

  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: 'Failed to submit contact' });
  }
});

// Get user contacts
app.get('/api/contacts/user', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const contacts = await readJsonFile(CONTACTS_DB) || [];
    const userContacts = contacts.filter(contact => contact.userId === uid);
    
    res.json({
      success: true,
      contacts: userContacts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    });

  } catch (error) {
    console.error('Get user contacts error:', error);
    res.status(500).json({ error: 'Failed to get user contacts' });
  }
});

// Leaderboard endpoint
app.get('/api/leaderboard', authenticateUser, async (req, res) => {
  try {
    const users = await readJsonFile(USERS_DB) || {};
    
    const leaderboard = Object.values(users)
      .map(user => ({
        name: user.name,
        email: user.email.replace(/(.{3}).*@/, '$1***@'), // Anonymize email
        totalContacts: user.totalContacts || 0,
        registeredAt: user.registeredAt
      }))
      .sort((a, b) => b.totalContacts - a.totalContacts)
      .slice(0, 10);

    res.json({
      success: true,
      leaderboard
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// AI tools endpoints
app.post('/api/ai/resume-optimizer', authenticateUser, async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    
    if (!resume) {
      return res.status(400).json({ error: 'Resume content is required' });
    }

    // Mock AI response (in production, integrate with actual AI service)
    const suggestions = [
      'Add more quantifiable achievements with specific numbers and metrics',
      'Include relevant keywords from the job description',
      'Strengthen your summary statement to highlight key skills',
      'Add more technical skills relevant to the position',
      'Include action verbs at the beginning of bullet points'
    ];

    const optimizedSections = {
      summary: 'Enhanced summary with better positioning...',
      skills: ['Added relevant technical skills', 'Industry-specific competencies'],
      experience: 'Improved work experience descriptions with quantified achievements...'
    };

    res.json({
      success: true,
      suggestions,
      optimizedSections,
      score: 85
    });

  } catch (error) {
    console.error('Resume optimizer error:', error);
    res.status(500).json({ error: 'Resume optimization failed' });
  }
});

app.post('/api/ai/cover-letter', authenticateUser, async (req, res) => {
  try {
    const { jobDescription, resume, company } = req.body;
    
    if (!jobDescription || !company) {
      return res.status(400).json({ error: 'Job description and company are required' });
    }

    // Mock AI-generated cover letter
    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${company}. With my background and skills, I am confident I would be a valuable addition to your team.

[AI-generated content based on job description and resume would go here...]

I am excited about the opportunity to contribute to ${company}'s continued success and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for your consideration.

Best regards,
[Your Name]`;

    res.json({
      success: true,
      coverLetter,
      tips: [
        'Customize the opening paragraph for the specific role',
        'Highlight 2-3 key achievements that match job requirements',
        'Research the company culture and values to personalize your approach'
      ]
    });

  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: 'Cover letter generation failed' });
  }
});

app.post('/api/ai/interview-prep', authenticateUser, async (req, res) => {
  try {
    const { jobDescription, experience } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    // Mock interview questions and answers
    const questions = [
      {
        question: 'Tell me about yourself.',
        suggestedAnswer: 'Focus on your professional background, key achievements, and what drives your career goals...',
        tips: ['Keep it under 2 minutes', 'Focus on professional highlights', 'Connect to the role']
      },
      {
        question: 'Why are you interested in this position?',
        suggestedAnswer: 'Based on the job description, highlight specific aspects that align with your goals...',
        tips: ['Show you researched the company', 'Connect your skills to their needs', 'Be specific']
      },
      {
        question: 'What are your greatest strengths?',
        suggestedAnswer: 'Choose strengths that directly relate to the job requirements...',
        tips: ['Provide specific examples', 'Quantify your impact', 'Be authentic']
      }
    ];

    res.json({
      success: true,
      questions,
      generalTips: [
        'Research the company thoroughly',
        'Prepare STAR format examples',
        'Practice your answers out loud',
        'Prepare thoughtful questions to ask'
      ]
    });

  } catch (error) {
    console.error('Interview prep error:', error);
    res.status(500).json({ error: 'Interview preparation failed' });
  }
});

// Credit management endpoints
app.post('/api/credits/purchase', authenticateUser, async (req, res) => {
  try {
    const { package: creditPackage } = req.body;
    const { uid } = req.user;
    
    const packages = {
      basic: { credits: 10, price: 299 },
      standard: { credits: 25, price: 699 },
      premium: { credits: 50, price: 1299 }
    };
    
    if (!packages[creditPackage]) {
      return res.status(400).json({ error: 'Invalid credit package' });
    }

    // In production, integrate with payment gateway
    // For now, just add credits (mock purchase)
    const credits = await readJsonFile(CREDITS_DB) || {};
    credits[uid] = (credits[uid] || 0) + packages[creditPackage].credits;
    await writeJsonFile(CREDITS_DB, credits);

    res.json({
      success: true,
      message: 'Credits purchased successfully',
      newBalance: credits[uid],
      purchased: packages[creditPackage]
    });

  } catch (error) {
    console.error('Credit purchase error:', error);
    res.status(500).json({ error: 'Credit purchase failed' });
  }
});

app.get('/api/credits/balance', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const credits = await readJsonFile(CREDITS_DB) || {};
    const balance = credits[uid] || 0;

    res.json({
      success: true,
      balance,
      packages: {
        basic: { credits: 10, price: 299 },
        standard: { credits: 25, price: 699 },
        premium: { credits: 50, price: 1299 }
      }
    });

  } catch (error) {
    console.error('Get credit balance error:', error);
    res.status(500).json({ error: 'Failed to get credit balance' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await ensureDataDirectory();
    
    app.listen(PORT, () => {
      console.log(`🚀 T&P Ambassador Tool API running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔥 Firebase Admin: ${firebaseApp ? 'Enabled' : 'Mock Mode'}`);
      console.log(`🌐 CORS Origin: ${process.env.NODE_ENV === 'production' ? 'Production domains' : 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();