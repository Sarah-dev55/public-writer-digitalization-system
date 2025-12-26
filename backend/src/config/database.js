const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        // Support both MONGODB_URI (new) and MONGO_URI (old) for compatibility
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/publicwriter';

        await mongoose.connect(uri);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;