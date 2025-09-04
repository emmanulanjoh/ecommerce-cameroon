const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

const cleanOldLogs = () => {
  if (!fs.existsSync(logsDir)) return;

  const files = fs.readdirSync(logsDir);
  const now = Date.now();

  files.forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    
    if (now - stats.mtime.getTime() > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old log file: ${file}`);
    }
  });
};

cleanOldLogs();