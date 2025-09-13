// Database initialization and connection utility
// This will use a simple file-based approach until better-sqlite3 is available

import * as fs from 'fs';
import * as path from 'path';

export interface Database {
  exec(sql: string): void;
  prepare(sql: string): any;
  close(): void;
}

class SimpleDatabase {
  private dbPath: string;
  private data: any = {
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

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.data = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.initializeData();
    }
  }

  private saveData() {
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

  private initializeData() {
    this.data = {
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
    this.saveData();
  }

  exec(sql: string): void {
    // Basic SQL execution simulation
    console.log('Executing SQL:', sql);
    this.saveData();
  }

  prepare(sql: string) {
    return {
      get: (params?: any) => this.executeQuery(sql, params, 'get'),
      all: (params?: any) => this.executeQuery(sql, params, 'all'),
      run: (params?: any) => this.executeQuery(sql, params, 'run')
    };
  }

  private executeQuery(sql: string, params: any, type: 'get' | 'all' | 'run') {
    // Simple query execution simulation
    // This is a placeholder until proper SQLite is available
    
    if (sql.includes('SELECT * FROM users')) {
      return type === 'all' ? this.data.users : this.data.users[0];
    }
    
    if (sql.includes('SELECT * FROM contacts')) {
      return type === 'all' ? this.data.contacts : this.data.contacts[0];
    }
    
    if (sql.includes('INSERT INTO users')) {
      const user = {
        id: this.generateId(),
        ...params,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.data.users.push(user);
      this.saveData();
      return { lastInsertRowid: user.id };
    }
    
    if (sql.includes('INSERT INTO contacts')) {
      const contact = {
        id: this.generateId(),
        ...params,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.data.contacts.push(contact);
      this.saveData();
      return { lastInsertRowid: contact.id };
    }
    
    return type === 'all' ? [] : null;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  close(): void {
    this.saveData();
  }
}

// Database connection
let db: Database | null = null;

export function getDatabase(): Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || './database/app.db';
    
    // Try to use SQLite if available, otherwise use simple file-based storage
    try {
      // This will be uncommented when better-sqlite3 is available
      // const Database = require('better-sqlite3');
      // db = new Database(dbPath);
      
      // For now, use simple file-based storage
      db = new SimpleDatabase(dbPath + '.json');
    } catch (error) {
      console.error('Database connection error:', error);
      db = new SimpleDatabase(dbPath + '.json');
    }
  }
  
  return db;
}

export function initializeDatabase(): void {
  const database = getDatabase();
  
  // Read and execute schema
  try {
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      database.exec(schema);
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}