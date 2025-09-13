// Backend server for T&P Ambassador Tool
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Import services
const AIService = require('./services/AIService');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple database simulation (since SQLite installation failed)
class SimpleDB {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'database', 'data.json');
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
    
    return {
      users: [],
      contacts: [],
      approvals: [],
      credits_history: [],
      ai_templates: [],
      settings: [
        { key: 'allowed_email_domain', value: 'kprit.edu.in' },
        { key: 'credits_per_approval', value: '1' },
        { key: 'max_pending_contacts_per_user', value: '10' }
      ]
    };
  }

  saveData() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // User operations
  createUser(userData) {
    const user = {
      id: this.generateId(),
      email: userData.email,
      name: userData.name,
      role: userData.role || 'ambassador',
      credits: 0,
      team_role: userData.team_role || null,
      firebase_uid: userData.firebase_uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  getUserByEmail(email) {
    return this.data.users.find(user => user.email === email);
  }

  getUserById(id) {
    return this.data.users.find(user => user.id === id);
  }

  updateUser(id, updates) {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.data.users[userIndex] = {
        ...this.data.users[userIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.saveData();
      return this.data.users[userIndex];
    }
    return null;
  }

  // Contact operations
  createContact(contactData) {
    const contact = {
      id: this.generateId(),
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      position: contactData.position,
      linkedin_url: contactData.linkedin_url,
      source: contactData.source,
      relevance_score: contactData.relevance_score || 0,
      submitted_by: contactData.submitted_by,
      status: 'pending',
      admin_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.data.contacts.push(contact);
    this.saveData();
    return contact;
  }

  getContactsByUser(userId) {
    return this.data.contacts.filter(contact => contact.submitted_by === userId);
  }

  getContactsByStatus(status) {
    return this.data.contacts.filter(contact => contact.status === status);
  }

  updateContactStatus(contactId, status, adminId, notes = null) {
    const contactIndex = this.data.contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      this.data.contacts[contactIndex].status = status;
      this.data.contacts[contactIndex].admin_notes = notes;
      this.data.contacts[contactIndex].updated_at = new Date().toISOString();
      
      // Create approval record
      const approval = {
        id: this.generateId(),
        contact_id: contactId,
        admin_id: adminId,
        action: status,
        notes: notes,
        created_at: new Date().toISOString()
      };
      this.data.approvals.push(approval);
      
      // Award credits if approved
      if (status === 'approved') {
        const contact = this.data.contacts[contactIndex];
        const userId = contact.submitted_by;
        
        // Add credits to user
        const userIndex = this.data.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          this.data.users[userIndex].credits += 1;
          this.data.users[userIndex].updated_at = new Date().toISOString();
        }
        
        // Add to credits history
        const creditHistory = {
          id: this.generateId(),
          user_id: userId,
          contact_id: contactId,
          credits_earned: 1,
          reason: `Contact approved: ${contact.company} - ${contact.name}`,
          created_at: new Date().toISOString()
        };
        this.data.credits_history.push(creditHistory);
      }
      
      this.saveData();
      return this.data.contacts[contactIndex];
    }
    return null;
  }

  // Leaderboard
  getLeaderboard(limit = 10) {
    return this.data.users
      .filter(user => user.role === 'ambassador')
      .sort((a, b) => b.credits - a.credits)
      .slice(0, limit)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        name: user.name,
        credits: user.credits,
        approvedContacts: this.data.contacts.filter(c => c.submitted_by === user.id && c.status === 'approved').length
      }));
  }

  // Stats
  getUserStats(userId) {
    const userContacts = this.data.contacts.filter(contact => contact.submitted_by === userId);
    const user = this.getUserById(userId);
    const leaderboard = this.getLeaderboard(100);
    const userRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;
    
    return {
      totalContacts: userContacts.length,
      approvedContacts: userContacts.filter(c => c.status === 'approved').length,
      pendingContacts: userContacts.filter(c => c.status === 'pending').length,
      rejectedContacts: userContacts.filter(c => c.status === 'rejected').length,
      totalCredits: user ? user.credits : 0,
      userRank: userRank || 0
    };
  }
}

// Initialize AI service
const aiService = new AIService();

// Initialize database
const db = new SimpleDB();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'T&P Ambassador Tool API is running' });
});

// User routes
app.post('/api/users', (req, res) => {
  try {
    const user = db.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const user = db.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Contact routes
app.post('/api/contacts', (req, res) => {
  try {
    const contact = db.createContact(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/contacts/user/:userId', (req, res) => {
  try {
    const contacts = db.getContactsByUser(req.params.userId);
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/contacts/pending', (req, res) => {
  try {
    const contacts = db.getContactsByStatus('pending');
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/contacts/:id/status', (req, res) => {
  try {
    const { status, adminId, notes } = req.body;
    const contact = db.updateContactStatus(req.params.id, status, adminId, notes);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Leaderboard route
app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = db.getLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stats route
app.get('/api/stats/:userId', (req, res) => {
  try {
    const stats = db.getUserStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// HR Search simulation (placeholder)
app.post('/api/search/hr', (req, res) => {
  try {
    const { query, type } = req.body;
    
    // Simulate API response
    const mockResults = [
      {
        id: '1',
        name: 'John Doe',
        position: 'HR Manager',
        company: 'Tech Corp',
        email: 'john.doe@techcorp.com',
        phone: '+1-555-0123',
        linkedin_url: 'https://linkedin.com/in/johndoe',
        source: 'manual',
        relevance_score: 8
      },
      {
        id: '2',
        name: 'Jane Smith',
        position: 'Talent Acquisition Specialist',
        company: 'Innovation Inc',
        email: 'jane.smith@innovation.com',
        phone: '+1-555-0124',
        linkedin_url: 'https://linkedin.com/in/janesmith',
        source: 'manual',
        relevance_score: 9
      }
    ];
    
    const filteredResults = mockResults.filter(result => 
      result.name.toLowerCase().includes(query.toLowerCase()) ||
      result.company.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({ success: true, data: filteredResults });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Routes

// Generate cold email template
app.post('/api/ai/email/cold', async (req, res) => {
  try {
    const { contactData, companyInfo } = req.body;
    const template = await aiService.generateColdEmail(contactData, companyInfo);
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate follow-up email template
app.post('/api/ai/email/followup', async (req, res) => {
  try {
    const { contactData, previousContext } = req.body;
    const template = await aiService.generateFollowUpEmail(contactData, previousContext);
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate call script
app.post('/api/ai/call-script', async (req, res) => {
  try {
    const { contactData, scenario } = req.body;
    const script = await aiService.generateCallScript(contactData, scenario);
    res.json({ success: true, data: script });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate LinkedIn message
app.post('/api/ai/linkedin', async (req, res) => {
  try {
    const { contactData } = req.body;
    const message = await aiService.generateLinkedInMessage(contactData);
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Personalize template
app.post('/api/ai/personalize', async (req, res) => {
  try {
    const { template, variables } = req.body;
    const personalizedContent = aiService.personalizeTemplate(template, variables);
    res.json({ success: true, data: { content: personalizedContent } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save template
app.post('/api/ai/templates', async (req, res) => {
  try {
    const template = await aiService.saveTemplate(req.body);
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get templates
app.get('/api/ai/templates', async (req, res) => {
  try {
    const { type } = req.query;
    const templates = await aiService.getTemplates(type);
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 T&P Ambassador Tool API running on port ${PORT}`);
  console.log(`📊 Database initialized at: ${db.dbPath}`);
});