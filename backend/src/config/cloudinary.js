const cloudinary = require('cloudinary').v2;

// Cloudinary can read CLOUDINARY_URL automatically if present,
// but we also support explicit env vars for clarity.
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
