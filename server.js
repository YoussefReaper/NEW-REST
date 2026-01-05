require('dotenv').config();
const connectDB = require('./utils/db');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
    if (!process.env.VERCEL) {
        console.error('Missing MONGO_URI in .env');
        process.exit(1);
    }
    console.warn('MONGO_URI is not set; API routes will fail until it is configured.');
}

if (MONGO_URI) {
    connectDB(MONGO_URI).catch(() => {
        if (!process.env.VERCEL) process.exit(1);
    });
}

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a different value.`);
        process.exit(1);
    }
    throw err;
});