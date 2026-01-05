const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

module.exports = connectDB;