const logs = [];

export function logAction(action) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, action };
  logs.push(logEntry);
}

export function getLogs() {
  return logs;
}
