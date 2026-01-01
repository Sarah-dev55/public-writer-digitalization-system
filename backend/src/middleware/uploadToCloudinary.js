const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => ({
		folder: 'kj-edutech/uploads',
		resource_type: 'auto', // pdf, images, etc.
		public_id: `${Date.now()}-${(file.originalname || 'file').replace(/\s+/g, '_')}`,
	}),
});

const upload = multer({
	storage,
	limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

module.exports = upload;
