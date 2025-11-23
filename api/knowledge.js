const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const KNOWLEDGE_BASE_URL = process.env.KNOWLEDGE_BASE_URL || 'http://localhost:3018';

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${KNOWLEDGE_BASE_URL}/health`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      status: '❌ Proxy Error',
      error: error.message
    });
  }
});

// Get all items with pagination
router.get('/items', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await fetch(`${KNOWLEDGE_BASE_URL}/api/items?page=${page}&limit=${limit}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search items
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await fetch(`${KNOWLEDGE_BASE_URL}/api/search?q=${encodeURIComponent(q)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add new item
router.post('/items', async (req, res) => {
  try {
    const response = await fetch(`${KNOWLEDGE_BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
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

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const response = await fetch(`${KNOWLEDGE_BASE_URL}/api/analytics`);
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
