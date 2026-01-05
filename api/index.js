const serverless = require('serverless-http');
const app = require('../app');

module.exports = async (req, res) => {
  const handler = serverless(app);
  return handler(req, res);
};
