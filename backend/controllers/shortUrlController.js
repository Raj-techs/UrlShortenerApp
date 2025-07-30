const ShortUrl = require('../models/ShortUrl');
const shortid = require('shortid');
const { StatusCodes } = require('http-status-codes');
const geoip = require('geoip-lite');
const useragent = require('useragent');

exports.createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  // Validate URL
  try {
    new URL(url);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      error: 'Invalid URL',
      details: err.message 
    });
  }

  // Validate shortcode (if provided)
  if (shortcode && !/^[a-zA-Z0-9]{4,10}$/.test(shortcode)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      error: 'Shortcode must be 4-10 alphanumeric characters' 
    });
  }

  // Generate shortcode if not provided
  const finalShortcode = shortcode || shortid.generate();
  const expiresAt = new Date(Date.now() + validity * 60000); // Convert minutes to ms

  try {
    const shortUrl = await ShortUrl.create({
      originalUrl: url,
      shortCode: finalShortcode,
      expiresAt,
    });

    return res.status(StatusCodes.CREATED).json({
      shortLink: `${req.protocol}://${req.get('host')}/${finalShortcode}`,
      expiry: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error('Error creating short URL:', err);

    if (err.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({ 
        error: 'Shortcode already exists' 
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Validation failed',
        details: err.errors
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.redirectShortUrl = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const shortUrl = await ShortUrl.findOne({ shortCode: shortcode });

    if (!shortUrl) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Short URL not found' });
    }

    if (new Date() > shortUrl.expiresAt) {
      return res.status(StatusCodes.GONE).json({ error: 'Link expired' });
    }

    // Track click
    const geo = geoip.lookup(req.ip);
    const agent = useragent.parse(req.headers['user-agent']);

    shortUrl.clicks.push({
      ipAddress: req.ip,
      referrer: req.headers.referer || 'Direct',
      location: geo ? `${geo.city}, ${geo.country}` : 'Unknown',
      userAgent: agent.toString(),
    });

    await shortUrl.save();

    return res.redirect(shortUrl.originalUrl);
  } catch (err) {
    console.error('Error redirecting:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const shortUrl = await ShortUrl.findOne({ shortCode: shortcode });

    if (!shortUrl) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Short URL not found' });
    }

    return res.status(StatusCodes.OK).json({
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      createdAt: shortUrl.createdAt,
      expiresAt: shortUrl.expiresAt,
      totalClicks: shortUrl.clicks.length,
      clicks: shortUrl.clicks,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
  }
};
