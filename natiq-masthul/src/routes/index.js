const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: '🚀 API is running!', version: '1.0.0' });
});

router.get('/ping', (req, res) => {
    res.json({ pong: true });
});

module.exports = router;
