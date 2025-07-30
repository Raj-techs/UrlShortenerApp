const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const shortUrlsRouter = require('./routes/shortUrls');
const log = require('./middlewares/logger');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(log);

// Routes
app.use('/', shortUrlsRouter);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});