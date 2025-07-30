const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(
  path.join(__dirname, '../logs/backend.log'),
  { flags: 'a' }
);

const log = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${req.method} ${req.url}\n`;
  logStream.write(logMessage);
  next();
};

module.exports = log;