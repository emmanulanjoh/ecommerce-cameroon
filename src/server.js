const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Sanitization utility
const sanitizeForLog = (input) => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
};

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', sanitizeForLog(err.message || err));
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', sanitizeForLog(err.message || err));
  process.exit(1);
});

module.exports = app;