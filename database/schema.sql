-- SQLite Database Schema for T&P Ambassador Tool

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('ambassador', 'admin')) DEFAULT 'ambassador',
  credits INTEGER DEFAULT 0,
  team_role TEXT CHECK(team_role IN ('troopers', 'cold_outreach', 'outreach')) DEFAULT NULL,
  firebase_uid TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  linkedin_url TEXT,
  source TEXT CHECK(source IN ('signalhire', 'apollo', 'manual', 'linkedin')) NOT NULL,
  relevance_score INTEGER DEFAULT 0,
  submitted_by TEXT NOT NULL,
  status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submitted_by) REFERENCES users (id)
);

-- Approvals table (for tracking approval history)
CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  admin_id TEXT NOT NULL,
  action TEXT CHECK(action IN ('approved', 'rejected')) NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts (id),
  FOREIGN KEY (admin_id) REFERENCES users (id)
);

-- Credits history table
CREATE TABLE IF NOT EXISTS credits_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  contact_id TEXT,
  credits_earned INTEGER NOT NULL,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (contact_id) REFERENCES contacts (id)
);

-- AI templates table
CREATE TABLE IF NOT EXISTS ai_templates (
  id TEXT PRIMARY KEY,
  type TEXT CHECK(type IN ('email', 'call_script')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  variables TEXT, -- JSON string of variable names
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users (id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_contacts_submitted_by ON contacts(submitted_by);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_approvals_contact_id ON approvals(contact_id);
CREATE INDEX IF NOT EXISTS idx_credits_history_user_id ON credits_history(user_id);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES 
  ('allowed_email_domain', 'kprit.edu.in'),
  ('credits_per_approval', '1'),
  ('max_pending_contacts_per_user', '10');

-- Create triggers for updating timestamps
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_contacts_timestamp 
  AFTER UPDATE ON contacts
  BEGIN
    UPDATE contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Trigger to add credits when contact is approved
CREATE TRIGGER IF NOT EXISTS award_credits_on_approval
  AFTER UPDATE OF status ON contacts
  WHEN NEW.status = 'approved' AND OLD.status = 'pending'
  BEGIN
    INSERT INTO credits_history (id, user_id, contact_id, credits_earned, reason)
    VALUES (
      lower(hex(randomblob(16))),
      NEW.submitted_by,
      NEW.id,
      1,
      'Contact approved: ' || NEW.company || ' - ' || NEW.name
    );
    
    UPDATE users 
    SET credits = credits + 1 
    WHERE id = NEW.submitted_by;
  END;