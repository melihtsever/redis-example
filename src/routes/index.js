const express = require('express');
const itemRoutes = require('./item');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/items', itemRoutes);

module.exports = router;
