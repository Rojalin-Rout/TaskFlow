require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ success: true, message: 'API and database are healthy.' });
  } catch {
    res.status(503).json({ success: false, message: 'Database connection unavailable.' });
  }
});
app.use('/api/tasks', taskRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`TaskFlow API listening on http://localhost:${port}`));
