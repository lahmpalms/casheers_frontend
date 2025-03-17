# Logger Utility

This utility provides a production-safe way to handle console logs in your application.

## Usage

Instead of using `console.log`, `console.error`, etc. directly, import and use the logger utility:

```javascript
import logger from './utils/logger';

// Instead of console.log
logger.log('This message will only appear in development');

// Instead of console.error
try {
  // Some code that might throw an error
} catch (error) {
  logger.error('Error message', error);
  // In production, this will only log "An error occurred: Error message"
  // In development, it will log the full error details
}

// Other methods
logger.warn('Warning message');
logger.info('Info message');
```

## Benefits

1. **Production Safety**: In production, detailed error information is suppressed to prevent sensitive information from being exposed to users.
2. **Consistent Logging**: Provides a consistent interface for logging across your application.
3. **Environment-Aware**: Automatically adjusts logging behavior based on the environment.

## Implementation

The logger utility checks the `NODE_ENV` environment variable to determine if it's running in production. If so, it:

1. Suppresses all `log`, `warn`, and `info` messages
2. Replaces detailed error messages with generic ones

Additionally, the Next.js configuration has been updated to strip console logs from production builds. 