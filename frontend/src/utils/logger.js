export const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage); // In production, send to a logging service
};

export const logError = (error) => {
  log(`ERROR: ${error.message}`);
  if (error.stack) log(`STACK: ${error.stack}`);
};