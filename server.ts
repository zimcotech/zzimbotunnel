import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zimbo-tunnel-super-secret-key-2026';

// Database setup
const db = new Database('zimbo-tunnel.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    protocol TEXT NOT NULL,
    location TEXT NOT NULL,
    duration INTEGER NOT NULL,
    config TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    host TEXT,
    port INTEGER,
    username TEXT,
    password TEXT,
    uuid TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    phone_number TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Migration: Add columns if they don't exist
const tableInfo = db.prepare('PRAGMA table_info(servers)').all() as any[];
const columns = tableInfo.map(col => col.name);
if (!columns.includes('host')) db.exec('ALTER TABLE servers ADD COLUMN host TEXT');
if (!columns.includes('port')) db.exec('ALTER TABLE servers ADD COLUMN port INTEGER');
if (!columns.includes('username')) db.exec('ALTER TABLE servers ADD COLUMN username TEXT');
if (!columns.includes('password')) db.exec('ALTER TABLE servers ADD COLUMN password TEXT');
if (!columns.includes('uuid')) db.exec('ALTER TABLE servers ADD COLUMN uuid TEXT');

app.use(cors());
app.use(express.json());

// Middleware for authentication
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    (req as any).user = user;
    next();
  });
};

// API Routes

// --- AUTHENTICATION SYSTEM ---
// Handles user registration with secure password hashing using bcrypt
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(username, email, hashedPassword);

    const token = jwt.sign({ id: info.lastInsertRowid, username, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: info.lastInsertRowid, username, email, balance: 0, role: 'user' } });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Handles user login, supports both email and username
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?');
    const user = stmt.get(email, email) as any;

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, balance: user.balance, role: user.role, created_at: user.created_at } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const stmt = db.prepare('SELECT id, username, email, balance, role, created_at FROM users WHERE id = ?');
  const user = stmt.get(userId);
  res.json(user);
});

// Servers
app.get('/api/servers', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const stmt = db.prepare('SELECT * FROM servers WHERE user_id = ? ORDER BY created_at DESC');
  const servers = stmt.all(userId);
  res.json(servers);
});

// Get single server
app.get('/api/servers/:id', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const serverId = req.params.id;
  const stmt = db.prepare('SELECT * FROM servers WHERE id = ? AND user_id = ?');
  const server = stmt.get(serverId, userId);
  if (!server) {
    res.status(404).json({ error: 'Server not found' });
    return;
  }
  res.json(server);
});

// Delete server
app.delete('/api/servers/:id', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const serverId = req.params.id;
  const stmt = db.prepare('DELETE FROM servers WHERE id = ? AND user_id = ?');
  const info = stmt.run(serverId, userId);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Server not found' });
    return;
  }
  res.json({ success: true });
});

// --- SERVER CREATION SYSTEM ---
// Handles creating a new tunneling server and deducting balance
app.post('/api/servers', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const { protocol, location, duration } = req.body;

  // Pricing logic (mock)
  const pricePerDay = 0.5; // 0.5 credits per day
  const cost = duration * pricePerDay;

  const dbTransaction = db.transaction(() => {
    const userStmt = db.prepare('SELECT balance FROM users WHERE id = ?');
    const user = userStmt.get(userId) as any;

    if (user.balance < cost) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(cost, userId);

    // Generate mock config
    const config = `${protocol}://${Math.random().toString(36).substring(2, 15)}@${location.toLowerCase().replace(' ', '')}.zimbotunnel.com:443?security=tls&type=ws`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(duration));
    
    // Mock data for new fields
    const host = `${location.toLowerCase().replace(' ', '')}.zimbotunnel.com`;
    const port = 443;
    const username = `user_${Math.random().toString(36).substring(2, 8)}`;
    const password = Math.random().toString(36).substring(2, 12);
    const uuid = Math.random().toString(36).substring(2, 15);

    const insertStmt = db.prepare('INSERT INTO servers (user_id, protocol, location, duration, config, expires_at, host, port, username, password, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const info = insertStmt.run(userId, protocol, location, duration, config, expiresAt.toISOString(), host, port, username, password, uuid);

    return { id: info.lastInsertRowid, protocol, location, duration, config, expires_at: expiresAt.toISOString(), host, port, username, password, uuid };
  });

  try {
    const result = dbTransaction();
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// --- TOP-UP SYSTEM ---
// Simulates EcoCash integration with a delay and updates user balance
app.post('/api/topup', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const { phoneNumber, amount } = req.body;

  if (!phoneNumber || !amount || amount <= 0) {
    res.status(400).json({ error: 'Invalid top-up details' });
    return;
  }

  // Simulate EcoCash payment delay
  setTimeout(() => {
    const dbTransaction = db.transaction(() => {
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amount, userId);
      db.prepare('INSERT INTO transactions (user_id, amount, phone_number) VALUES (?, ?, ?)').run(userId, amount, phoneNumber);
      
      const userStmt = db.prepare('SELECT balance FROM users WHERE id = ?');
      return userStmt.get(userId);
    });

    try {
      const result = dbTransaction();
      res.json({ success: true, newBalance: (result as any).balance });
    } catch (error) {
      res.status(500).json({ error: 'Top-up failed' });
    }
  }, 1500);
});

// --- PAYMENT WEBHOOK (IPN) ---
// This endpoint receives background POST data from the payment gateway when a user pays
app.post('/api/webhooks/payment', (req, res) => {
  // 1. Extract data sent by the payment gateway
  // The exact field names depend on your gateway (e.g., Paynow uses 'reference', 'status', 'hash')
  const { reference, status, amount, hash } = req.body;

  console.log('Received payment webhook:', req.body);

  // 2. CRITICAL SECURITY CHECK: Verify the signature/hash!
  // You MUST verify the hash using your Merchant Key to ensure the request actually came from the payment gateway and not a hacker.
  /* 
  const expectedHash = generateHash(req.body, process.env.MERCHANT_KEY);
  if (hash !== expectedHash) {
    console.error('Security alert: Invalid webhook signature');
    res.status(400).send('Invalid signature');
    return;
  }
  */

  // 3. Process the successful payment
  if (status === 'Paid' || status === 'completed') {
    try {
      const dbTransaction = db.transaction(() => {
        // Find the transaction in your database using the reference ID
        const txStmt = db.prepare('SELECT * FROM transactions WHERE id = ? AND status = ?');
        const tx = txStmt.get(reference, 'pending') as any;

        if (tx) {
          // Mark transaction as completed
          db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run('completed', tx.id);
          
          // Credit the user's balance
          db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(tx.amount, tx.user_id);
          
          console.log(`Successfully credited user ${tx.user_id} with ${tx.amount} credits.`);
        } else {
          console.log(`Transaction ${reference} already processed or not found.`);
        }
      });

      dbTransaction();
      
      // 4. Acknowledge receipt
      // You must return a 200 OK status, otherwise the gateway will keep retrying the POST request
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook database error:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    // Handle failed, cancelled, or refunded payments here
    res.status(200).send('OK'); // Still return 200 so the gateway stops retrying
  }
});

app.get('/api/transactions', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const stmt = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC');
  const transactions = stmt.all(userId);
  res.json(transactions);
});

// Admin routes (mock)
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if ((req as any).user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  const serversCount = db.prepare('SELECT COUNT(*) as count FROM servers').get() as any;
  const totalRevenue = db.prepare('SELECT SUM(amount) as total FROM transactions').get() as any;

  res.json({
    users: usersCount.count,
    servers: serversCount.count,
    revenue: totalRevenue.total || 0
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
