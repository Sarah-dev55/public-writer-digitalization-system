const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ msg: 'List documents' }));
router.post('/', (req, res) => res.json({ msg: 'Upload document', body: req.body }));

module.exports = router;
