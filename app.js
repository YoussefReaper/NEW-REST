const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('./passport');

const connectDB = require('./utils/db');
const { swaggerUi, specs } = require('./swagger');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
  })
);

app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState === 1) return next();

  const uri = process.env.MONGO_URI;
  if (!uri) return res.status(500).json({ error: 'Missing MONGO_URI' });

  try {
    await connectDB(uri);
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true, swaggerUrl: '/api-docs.json' }));
app.get('/api-docs.json', (req, res) => res.json(specs));

app.get('/', (req, res) => res.redirect('/api-docs'));

const authSession = session({
  secret: process.env.SESSION_SECRET || 'aurocore-secret',
  resave: false,
  saveUninitialized: false
});

app.use('/api/auth', authSession, passport.initialize(), passport.session(), require('./routes/auth'));

app.use('/api/journals', require('./routes/journal'));
app.use('/api/plans', require('./routes/plan'));
app.use('/api/user', require('./routes/user'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/tracker', require('./routes/tracker'));
app.use('/api/memories', require('./routes/memory'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/notes', require('./routes/notes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: Date.now() }));

module.exports = app;
