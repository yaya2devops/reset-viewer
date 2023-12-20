import express from 'express';
import low from 'lowdb';
import { FileSync } from 'lowdb/adapters/FileSync';
import path from 'path';

const app = express();
const adapter = new FileSync('db.json');
const db = low(adapter);

// Initialize the database with a counter
db.defaults({ counter: 0 }).write();

// Middleware to increment the counter on each request
app.use((req, res, next) => {
  db.update('counter', n => n + 1).write();
  next();
});

// Route to get the current viewer count
app.get('/count', (req, res) => {
  const count = db.get('counter').value();
  res.json({ count });
});

// Serve your Docsify site here
const docsifyPath = path.join(__dirname, 'path/to/your/docsify/site');
app.use(express.static(docsifyPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
