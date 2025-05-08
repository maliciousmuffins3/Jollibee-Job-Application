const db = require('../database/db.js');

let lastCheckedTime = new Date();

async function pollAuditLog(io) {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM audit_log WHERE executed_at > ? ORDER BY executed_at ASC`,
      [lastCheckedTime]
    );

    if (rows.length > 0) {
      lastCheckedTime = new Date();

      rows.forEach((log) => {
        io.emit('audit-event', {
          table: log.table_name,
          operation: log.operation,
          time: log.executed_at,
        });
      });
    }
  } catch (err) {
    console.error('Error polling audit log:', err);
  }
}

// Repeatedly poll every 5 seconds
function startAuditPolling(io) {
  setInterval(() => pollAuditLog(io), 5000);
}

module.exports = startAuditPolling;
