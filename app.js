const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

require('./passport');

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

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'aurocore-secret',
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/api-docs.json', (req, res) => res.json(specs));

app.use('/api/auth', require('./routes/auth'));

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
