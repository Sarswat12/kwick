const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const cwd = path.resolve(__dirname, '..');
const logDir = path.join(cwd, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const logPath = path.join(logDir, 'dev.log');

// Open log file for append and get file descriptor
const outFd = fs.openSync(logPath, 'a');

// Spawn Vite directly from node_modules and redirect stdout/stderr to the log file
const viteBin = path.join(cwd, 'node_modules', 'vite', 'bin', 'vite.js');
const child = spawn(process.execPath, [viteBin], {
  cwd,
  detached: true,
  stdio: ['ignore', outFd, outFd]
});

child.unref();
console.log('Vite dev server launched detached. Logs are being written to', logPath);
