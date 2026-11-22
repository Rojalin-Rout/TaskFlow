const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateTask } = require('../validation');

const columns = ['title', 'description', 'status', 'priority', 'due_date'];

function clean(body) {
  return {
    title: body.title.trim(),
    description: body.description || null,
    status: body.status || 'Pending',
    priority: body.priority || 'Medium',
    due_date: body.due_date || null
  };
}

// Dashboard counters
router.get('/stats', async (_req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS total,
      SUM(status='Pending') AS pending,
      SUM(status='In Progress') AS in_progress,
      SUM(status='Completed') AS completed
      FROM tasks
    `);
    const s = rows[0];
    res.json({ total: Number(s.total || 0), pending: Number(s.pending || 0), inProgress: Number(s.in_progress || 0), completed: Number(s.completed || 0) });
  } catch (e) { next(e); }
});

// Search and filters
router.get('/', async (req, res, next) => {
  try {
    const { search = '', status = '', priority = '', sort = 'newest' } = req.query;
    const where = [];
    const values = [];
    if (search.trim()) {
      where.push('(title LIKE ? OR description LIKE ?)');
      values.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }
    if (status) { where.push('status = ?'); values.push(status); }
    if (priority) { where.push('priority = ?'); values.push(priority); }
    const order = sort === 'due_soon'
      ? 'due_date IS NULL ASC, due_date ASC, created_at DESC'
      : 'created_at DESC';
    const [rows] = await db.query(`SELECT * FROM tasks ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY ${order}`, values);
    res.json(rows);
  } catch (e) { next(e); }
});

// Retrieve one task
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Task not found.' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// Create
router.post('/', async (req, res, next) => {
  const errors = validateTask(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the task fields.', errors });
  try {
    const t = clean(req.body);
    const [result] = await db.query('INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)', [t.title, t.description, t.status, t.priority, t.due_date]);
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// Update
router.put('/:id', async (req, res, next) => {
  const errors = validateTask(req.body, true);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the task fields.', errors });
  try {
    const [existing] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'Task not found.' });
    const current = existing[0];
    const t = {
      title: req.body.title !== undefined ? req.body.title.trim() : current.title,
      description: req.body.description !== undefined ? req.body.description : current.description,
      status: req.body.status !== undefined ? req.body.status : current.status,
      priority: req.body.priority !== undefined ? req.body.priority : current.priority,
      due_date: req.body.due_date !== undefined ? (req.body.due_date || null) : current.due_date
    };
    await db.query('UPDATE tasks SET title=?, description=?, status=?, priority=?, due_date=? WHERE id=?', [t.title, t.description, t.status, t.priority, t.due_date, req.params.id]);
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (e) { next(e); }
});

module.exports = router;
