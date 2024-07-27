const fs = require('fs');
const path = require('path');

function logMessage(message) {
  const logFile = path.join(__dirname, 'server.log');
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

function logError(error) {
  const errorFile = path.join(__dirname, 'error.log');
  const timestamp = new Date().toISOString();
  const errorEntry = `${timestamp} - ${error.stack || error}\n`;

  fs.appendFile(errorFile, errorEntry, (err) => {
    if (err) {
      console.error('Failed to write to error file:', err);
    }
  });
}

function validateWebhookRequest(req) {
  if (!req.body || !req.body.fileId || !req.body.user) {
    logError('Invalid webhook request: ' + JSON.stringify(req.body));
    return false;
  }
  return true;
}

function formatUpdateMessage(update) {
  return `File: ${update.fileId} edited by ${update.user} at ${new Date().toLocaleString()}`;
}
module.exports = {
  logMessage,
  logError,
  validateWebhookRequest,
  formatUpdateMessage
};
