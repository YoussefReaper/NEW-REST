const serverless = require('serverless-http');
const connectDB = require('../utils/db');
const app = require('../app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      res.statusCode = 500;
      return res.end('Missing MONGO_URI');
    }
    await connectDB(uri);
    isConnected = true;
  }

  const handler = serverless(app);
  return handler(req, res);
};
