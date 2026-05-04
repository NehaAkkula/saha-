import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db, { initDb } from './src/lib/server-db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET || 'saha-secret-key-2026';

async function startServer() {
  initDb();
  console.log("Database initialized");
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Middleware: Auth
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Middleware: RBAC
  const authorizeRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
      }
      next();
    };
  };

  // --- HELPERS ---
  const logActivity = (userId: string, action: string, targetType?: string, targetId?: string, details?: string) => {
    db.prepare('INSERT INTO activities (id, userId, action, targetType, targetId, details) VALUES (?, ?, ?, ?, ?, ?)')
      .run(`act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, userId, action, targetType, targetId, details);
  };

  const createNotification = (userId: string, title: string, message: string, type: string = 'System') => {
    db.prepare('INSERT INTO notifications (id, userId, title, message, type) VALUES (?, ?, ?, ?, ?)')
      .run(`ntf-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, userId, title, message, type);
  };

  // --- AUTH & PROFILE IMPROVEMENTS ---
  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      // For security, don't reveal if user exists, but here we can be helpful for the demo
      return res.status(404).json({ message: "No account found with this email" });
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    db.prepare('INSERT INTO reset_tokens (id, userId, token, expiresAt) VALUES (?, ?, ?, ?)')
      .run(`tok-${Date.now()}`, user.id, token, expiresAt);

    // In a real app, send email. Here we return the token for demo purposes.
    res.json({ message: "Reset link generated", token });
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { token, password } = req.body;
    const resetRequest = db.prepare('SELECT * FROM reset_tokens WHERE token = ? AND expiresAt > ?').get(token, new Date().toISOString()) as any;

    if (!resetRequest) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, resetRequest.userId);
    db.prepare('DELETE FROM reset_tokens WHERE id = ?').run(resetRequest.id);

    logActivity(resetRequest.userId, 'RESET_PASSWORD', 'User', resetRequest.userId, 'Password was reset via token');
    res.json({ message: "Password updated successfully" });
  });

  app.patch("/api/users/profile", authenticateToken, (req: any, res) => {
    const { displayName, jobTitle, photoURL, email } = req.body;
    
    // Check if email taken if changed
    if (email) {
      const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id);
      if (existing) return res.status(400).json({ message: "Email already in use" });
    }

    db.prepare('UPDATE users SET displayName = ?, jobTitle = ?, photoURL = ?, email = ? WHERE id = ?')
      .run(displayName, jobTitle, photoURL, email, req.user.id);
    
    logActivity(req.user.id, 'UPDATE_PROFILE', 'User', req.user.id);
    res.json({ message: "Profile updated" });
  });

  app.get("/api/users/:id/profile", authenticateToken, (req, res) => {
    const user = db.prepare('SELECT id, email, displayName, role, jobTitle, status, photoURL, createdAt FROM users WHERE id = ?').get(req.params.id) as any;
    if (!user) return res.status(404).json({ message: "User not found" });

    const activities = db.prepare('SELECT * FROM activities WHERE userId = ? ORDER BY createdAt DESC LIMIT 10').all(req.params.id);
    const teams = db.prepare(`
      SELECT t.*, tm.role as teamRole 
      FROM teams t 
      JOIN team_members tm ON t.id = tm.teamId 
      WHERE tm.userId = ?
    `).all(req.params.id);

    res.json({ ...user, activities, teams });
  });

  // --- NOTIFICATION ROUTES ---
  app.get("/api/notifications", authenticateToken, (req: any, res) => {
    const notifications = db.prepare('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC').all(req.user.id);
    res.json(notifications);
  });

  app.patch("/api/notifications/read-all", authenticateToken, (req: any, res) => {
    db.prepare('UPDATE notifications SET isRead = 1 WHERE userId = ?').run(req.user.id);
    res.json({ message: "All marked as read" });
  });

  app.patch("/api/notifications/:id", authenticateToken, (req: any, res) => {
    db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);
    res.json({ message: "Notification marked as read" });
  });

  app.delete("/api/notifications/:id", authenticateToken, (req: any, res) => {
    db.prepare('DELETE FROM notifications WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);
    res.json({ message: "Notification deleted" });
  });
  app.post("/api/auth/register", (req, res) => {
    const { email, password, displayName, role, jobTitle } = req.body;
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const id = `user-${Date.now()}`;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (id, email, password, role, displayName, jobTitle, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, email, hashedPassword, role || 'Team Member', displayName, jobTitle, 'Active');
    
    const user = db.prepare('SELECT id, email, displayName, role, jobTitle FROM users WHERE id = ?').get(id);
    const token = jwt.sign({ id, email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update status to Active on login
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('Active', user.id);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user = db.prepare('SELECT id, email, displayName, role, jobTitle, status, photoURL, emailVerified, createdAt FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  });

  app.post("/api/users/status", authenticateToken, (req: any, res) => {
    const { status } = req.body;
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, req.user.id);
    res.json({ message: "Status updated" });
  });

  // --- TEAM ROUTES ---
  app.get("/api/teams", authenticateToken, (req, res) => {
    const teams = db.prepare('SELECT t.*, u.displayName as leadName FROM teams t LEFT JOIN users u ON t.leadId = u.id').all();
    res.json(teams);
  });

  app.post("/api/teams", authenticateToken, authorizeRole(['Admin', 'Project Manager']), (req: any, res) => {
    const { name, description, leadId, visibility } = req.body;
    const id = `team-${Date.now()}`;
    db.prepare('INSERT INTO teams (id, name, description, ownerId, leadId, visibility) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, name, description, req.user.id, leadId, visibility || 'Public');
    
    // Add creator as member
    db.prepare('INSERT INTO team_members (teamId, userId, role) VALUES (?, ?, ?)')
      .run(id, req.user.id, req.user.role === 'Admin' ? 'Team Lead' : 'Team Lead');
      
    res.status(201).json({ id, name });
  });

  app.get("/api/teams/:id/members", authenticateToken, (req, res) => {
    const members = db.prepare(`
      SELECT u.id, u.email, u.displayName, u.jobTitle, u.status, tm.role as teamRole
      FROM team_members tm
      JOIN users u ON tm.userId = u.id
      WHERE tm.teamId = ?
    `).all(req.params.id);
    res.json(members);
  });

  // --- ASSESSMENT ROUTES ---
  app.get("/api/assessments", authenticateToken, (req, res) => {
    const assessments = db.prepare(`
      SELECT a.*, u.displayName, u.jobTitle, t.name as teamName
      FROM assessments a
      JOIN users u ON a.userId = u.id
      JOIN teams t ON a.teamId = t.id
      ORDER BY a.createdAt DESC
    `).all();
    res.json(assessments);
  });

  // --- WORKFLOW ROUTES ---
  app.get("/api/workflows/:projectId", authenticateToken, (req, res) => {
    const workflow = db.prepare('SELECT * FROM workflows WHERE projectId = ?').get(req.params.projectId) as any;
    if (!workflow) return res.json({ nodes: '[]', edges: '[]' });
    res.json({ nodes: workflow.nodes, edges: workflow.edges });
  });

  app.post("/api/workflows/:projectId", authenticateToken, (req, res) => {
    const { nodes, edges } = req.body;
    const existing = db.prepare('SELECT id FROM workflows WHERE projectId = ?').get(req.params.projectId);
    if (existing) {
      db.prepare('UPDATE workflows SET nodes = ?, edges = ?, updatedAt = CURRENT_TIMESTAMP WHERE projectId = ?')
        .run(JSON.stringify(nodes), JSON.stringify(edges), req.params.projectId);
    } else {
      db.prepare('INSERT INTO workflows (id, projectId, nodes, edges) VALUES (?, ?, ?, ?)')
        .run(`wf-${Date.now()}`, req.params.projectId, JSON.stringify(nodes), JSON.stringify(edges));
    }
    res.json({ message: "Workflow saved" });
  });

  // --- SUGGESTION ROUTES ---
  app.get("/api/suggestions", authenticateToken, (req, res) => {
    const suggestions = [
      { id: 1, title: 'MERN Stack Task Manager', category: 'Web Development', difficulty: 'Medium', stack: 'MongoDB, Express, React, Node', duration: '4 weeks', description: 'Real-time task synchronization platform.' },
      { id: 2, title: 'AI Resume Analyzer', category: 'AI/ML', difficulty: 'Hard', stack: 'Python, OpenAI, React', duration: '6 weeks', description: 'NLP-based resume scoring and feedback system.' },
      { id: 3, title: 'Smart Attendance System', category: 'IoT', difficulty: 'Medium', stack: 'Raspberry Pi, Python, Firebase', duration: '8 weeks', description: 'Facial recognition-based tracking for schools.' },
      { id: 4, title: 'Placement Management System', category: 'Web Development', difficulty: 'High', stack: 'Next.js, PostgreSQL, Tailwind', duration: '5 weeks', description: 'End-to-end recruiter and student portal.' },
      { id: 5, title: 'IoT Smart Home Hub', category: 'IoT', difficulty: 'Hard', stack: 'Arduino, Node-RED, MQTT', duration: '10 weeks', description: 'Unified control for home smart devices.' },
      { id: 6, title: 'Blockchain Voting System', category: 'Blockchain', difficulty: 'Hard', stack: 'Solidity, Ethereum, Web3.js', duration: '12 weeks', description: 'Decentralized and tamper-proof voting.' },
    ];
    res.json(suggestions);
  });

  // --- PROJECT ROUTES ---
  app.get("/api/activities", authenticateToken, (req, res) => {
    const activities = db.prepare(`
      SELECT a.*, u.displayName, u.photoURL, u.jobTitle 
      FROM activities a 
      JOIN users u ON a.userId = u.id 
      ORDER BY a.createdAt DESC LIMIT 20
    `).all();
    res.json(activities);
  });

  app.get("/api/projects", authenticateToken, (req, res) => {
    const projects = db.prepare('SELECT p.*, u.displayName as managerName FROM projects p LEFT JOIN users u ON p.managerId = u.id ORDER BY p.createdAt DESC').all();
    res.json(projects);
  });

  app.get("/api/projects/:id", authenticateToken, (req, res) => {
    const project = db.prepare('SELECT p.*, u.displayName as managerName FROM projects p LEFT JOIN users u ON p.managerId = u.id WHERE p.id = ?').get(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.get("/api/projects/:id/tasks", authenticateToken, (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE projectId = ? ORDER BY createdAt DESC').all(req.params.id);
    res.json(tasks);
  });

  app.post("/api/projects", authenticateToken, authorizeRole(['Admin', 'Project Manager']), (req: any, res) => {
    const { name, description, priority, endDate, teamId } = req.body;
    const id = `proj-${Date.now()}`;
    db.prepare('INSERT INTO projects (id, name, description, status, priority, managerId, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, name, description, 'Active', priority || 'Medium', req.user.id, new Date().toISOString(), endDate);
    
    logActivity(req.user.id, 'CREATE_PROJECT', 'Project', id, `Created project: ${name}`);
    createNotification(req.user.id, 'Project Created', `Successfully initiated project: ${name}`, 'Project');

    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.status(201).json(newProject);
  });

  // --- ANALYTICS ---
  app.get("/api/analytics/summary", authenticateToken, (req, res) => {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get() as any;
    const activeTasks = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status != "Completed"').get() as any;
    const completedTasks = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status = "Completed"').get() as any;
    
    res.json({
      totalProjects: totalProjects.count,
      activeTasks: activeTasks.count,
      completedTasks: completedTasks.count,
      overdueTasks: 0,
      productivityScore: 85,
      weeklyProgress: [45, 52, 60, 48, 70, 85, 90],
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
