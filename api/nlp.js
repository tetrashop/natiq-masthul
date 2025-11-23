const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const NLP_SERVER_URL = process.env.NLP_SERVER_URL || 'http://localhost:3004';

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${NLP_SERVER_URL}/health`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      status: '❌ Proxy Error',
      error: error.message
    });
  }
});

// Generate sample posts
router.post('/generate-samples', async (req, res) => {
  try {
    const response = await fetch(`${NLP_SERVER_URL}/api/nlp/generate-samples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get posts with pagination
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const response = await fetch(`${NLP_SERVER_URL}/api/nlp/posts?page=${page}&limit=${limit}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
