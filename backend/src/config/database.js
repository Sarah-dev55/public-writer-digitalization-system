const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/publicwriter';

async function connect() {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		// eslint-disable-next-line no-console
		console.log('MongoDB connected:', MONGO_URI);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('MongoDB connection error:', err.message);
		process.exit(1);
	}
}

module.exports = { connect, mongoose };
