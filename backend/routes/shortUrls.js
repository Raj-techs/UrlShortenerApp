const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/ShortUrl'); // Add this import
const {
  createShortUrl,
  redirectShortUrl,
  getStats,
} = require('../controllers/shortUrlController');
const log = require('../middlewares/logger');

router.use(log);

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getStats);
router.get('/:shortcode', redirectShortUrl);

// Add this new endpoint to get all URLs
router.get('/shorturls', async (req, res) => {
  try {
    const urls = await ShortUrl.find({});
    res.status(200).json(urls.map(url => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      totalClicks: url.clicks.length
    })));
  } catch (err) {
    console.error('Error fetching all URLs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;