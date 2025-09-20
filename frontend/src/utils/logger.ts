// Logger utility for frontend logging
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'error' : 'debug';

const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const shouldLog = (level: string) => {
  return logLevels[level as keyof typeof logLevels] >= logLevels[LOG_LEVEL as keyof typeof logLevels];
};

const formatLogMessage = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `${timestamp} [${LOG_LEVEL.toUpperCase()}] ${message}`;
  
  if (data) {
    return `${formattedMessage} ${JSON.stringify(data)}`;
  }
  
  return formattedMessage;
};

export const logDebug = (message: string, data?: any) => {
  if (!shouldLog('debug')) return;
  console.debug(formatLogMessage(message, data));
};

export const logInfo = (message: string, data?: any) => {
  if (!shouldLog('info')) return;
  console.info(formatLogMessage(message, data));
};

export const logWarn = (message: string, data?: any) => {
  if (!shouldLog('warn')) return;
  console.warn(formatLogMessage(message, data));
};

export const logError = (message: string, error?: any) => {
  if (!shouldLog('error')) return;
  console.error(formatLogMessage(message, error));
  
  // In production, you might want to send errors to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to logging service
    // sendToLoggingService({ level: 'error', message, error, timestamp: new Date().toISOString() });
  }
};