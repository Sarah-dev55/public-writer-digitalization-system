const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ msg: 'Mr Mensur info' }));
router.post('/', (req, res) => res.json({ msg: 'Create/Update MrMensur', body: req.body }));

module.exports = router;
