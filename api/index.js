const serverless = require('serverless-http');
const connectDB = require('../utils/db');
const app = require('../app');

let isConnected = false;

module.exports = async (req, res) => {
  const path = (req.url || '').split('?')[0];
  const isDocsOrHealth =
    path === '/api-docs.json' ||
    path.startsWith('/api-docs') ||
    path === '/api/health';

  if (!isDocsOrHealth && !isConnected) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      res.statusCode = 500;
      return res.end('Missing MONGO_URI');
    }

    try {
      await connectDB(uri);
      isConnected = true;
    } catch (err) {
      res.statusCode = 500;
      return res.end('Database connection failed');
    }
  }

  const handler = serverless(app);
  return handler(req, res);
};
