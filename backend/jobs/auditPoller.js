const db = require('../database/db.js'); // MySQL connection pool
const pollAuditLog = require('../controllers/auditLogController.js');

function startAuditPolling(io) {
  setInterval(() => {
    pollAuditLog(io, db);
  }, 3000); // Poll every 3 seconds
}

module.exports = { startAuditPolling };
