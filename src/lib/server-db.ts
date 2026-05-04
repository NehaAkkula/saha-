import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const db = new Database('saha.db');

export function initDb() {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      displayName TEXT,
      photoURL TEXT,
      role TEXT CHECK(role IN ('Admin', 'Project Manager', 'Team Member')) NOT NULL DEFAULT 'Team Member',
      jobTitle TEXT,
      status TEXT DEFAULT 'Offline',
      emailVerified INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Teams Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      ownerId TEXT,
      leadId TEXT,
      avatar TEXT,
      visibility TEXT CHECK(visibility IN ('Public', 'Private')) DEFAULT 'Public',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ownerId) REFERENCES users(id),
      FOREIGN KEY (leadId) REFERENCES users(id)
    )
  `);

  // Team Members association
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      teamId TEXT,
      userId TEXT,
      role TEXT CHECK(role IN ('Team Lead', 'Developer', 'Designer', 'Tester', 'Viewer')),
      joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (teamId, userId),
      FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Assessments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      userId TEXT,
      teamId TEXT,
      score INTEGER,
      tasksCompleted INTEGER,
      efficiency REAL,
      reportMonth TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (teamId) REFERENCES teams(id)
    )
  `);

  // Workflows Table (for React Flow persistent state)
  db.exec(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      projectId TEXT,
      nodes TEXT, -- JSON string
      edges TEXT, -- JSON string
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  // Projects Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('Pending', 'Active', 'Completed', 'On Hold')) DEFAULT 'Pending',
      priority TEXT CHECK(priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
      managerId TEXT,
      progress INTEGER DEFAULT 0,
      startDate DATETIME,
      endDate DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (managerId) REFERENCES users(id)
    )
  `);

  // Tasks Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      projectId TEXT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('Todo', 'In Progress', 'Review', 'Completed')) DEFAULT 'Todo',
      priority TEXT CHECK(priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
      assigneeId TEXT,
      dueDate DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assigneeId) REFERENCES users(id)
    )
  `);

  // Notifications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      userId TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT CHECK(type IN ('Task', 'Project', 'Team', 'System', 'Alert')) DEFAULT 'System',
      isRead INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Password Reset Tokens
  db.exec(`
    CREATE TABLE IF NOT EXISTS reset_tokens (
      id TEXT PRIMARY KEY,
      userId TEXT,
      token TEXT UNIQUE NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // User Activities Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      userId TEXT,
      action TEXT NOT NULL,
      targetType TEXT,
      targetId TEXT,
      details TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  seedDemoUsers();
}

function seedDemoUsers() {
  const users = [
    { id: 'admin-1', email: 'admin@saha.com', password: 'Admin@123', role: 'Admin', displayName: 'System Admin', jobTitle: 'CTO' },
    { id: 'manager-1', email: 'manager@saha.com', password: 'Manager@123', role: 'Project Manager', displayName: 'Jane Cooper', jobTitle: 'Product Head' },
    { id: 'member-1', email: 'member@saha.com', password: 'Member@123', role: 'Team Member', displayName: 'Alex Smith', jobTitle: 'Frontend Dev' },
  ];

  const checkUser = db.prepare('SELECT id FROM users WHERE email = ?');
  const insertUser = db.prepare('INSERT INTO users (id, email, password, role, displayName, jobTitle) VALUES (?, ?, ?, ?, ?, ?)');

  users.forEach(u => {
    if (!checkUser.get(u.email)) {
      const hashedPassword = bcrypt.hashSync(u.password, 10);
      insertUser.run(u.id, u.email, hashedPassword, u.role, u.displayName, u.jobTitle);
      console.log(`Seeded user: ${u.email}`);
    }
  });

  // Seed Teams
  const teamId = 'team-alpha';
  if (!db.prepare('SELECT id FROM teams WHERE id = ?').get(teamId)) {
    db.prepare('INSERT INTO teams (id, name, description, ownerId, leadId, visibility) VALUES (?, ?, ?, ?, ?, ?)')
      .run(teamId, 'Engineering Alpha', 'Core engineering team for SAHA', 'admin-1', 'manager-1', 'Public');
    
    db.prepare('INSERT INTO team_members (teamId, userId, role) VALUES (?, ?, ?)')
      .run(teamId, 'manager-1', 'Team Lead');
    db.prepare('INSERT INTO team_members (teamId, userId, role) VALUES (?, ?, ?)')
      .run(teamId, 'member-1', 'Developer');
  }

  // Seed Assessments
  if (!db.prepare('SELECT id FROM assessments LIMIT 1').get()) {
    db.prepare('INSERT INTO assessments (id, userId, teamId, score, tasksCompleted, efficiency, reportMonth) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run('as-1', 'member-1', 'team-alpha', 85, 12, 92.5, '2026-04');
  }

  // Seed initial projects
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as any;
  if (projectCount.count === 0) {
    const insertProject = db.prepare('INSERT INTO projects (id, name, description, status, priority, managerId, progress, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertProject.run(
      'proj-1', 
      'SAHA Enterprise Portal', 
      'Building a premium project management portal for large scale teams.', 
      'Active', 
      'High', 
      'manager-1', 
      45, 
      '2026-05-01', 
      '2026-06-01'
    );
  }
}

export default db;
