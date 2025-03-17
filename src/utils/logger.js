/**
 * Logger utility to handle console logs in a production-safe way
 * In production, this will suppress detailed error information
 */

const isProd = process.env.NODE_ENV === 'production';

const logger = {
  log: (...args) => {
    if (!isProd) {
      console.log(...args);
    }
  },
  
  error: (message, error) => {
    if (isProd) {
      // In production, only log a generic message without the detailed error
      console.error(`An error occurred: ${message}`);
    } else {
      // In development, log the full error details
      console.error(message, error);
    }
  },
  
  warn: (...args) => {
    if (!isProd) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (!isProd) {
      console.info(...args);
    }
  }
};

export default logger; 