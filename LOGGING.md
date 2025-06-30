# Logging System Documentation

This project uses a comprehensive logging system built with **Winston** and **Morgan** to provide beautiful, informative console output and structured logging.

## Features

- 🎨 **Beautiful colored console output** with emojis and timestamps
- 📊 **HTTP request logging** with Morgan middleware
- 📝 **Structured logging** with metadata support
- 💾 **File logging** for errors and combined logs
- 🚀 **Performance monitoring** capabilities
- 🗄️ **Database operation logging**
- 🔍 **Multiple log levels** (error, warn, info, debug, success, http)

## Quick Start

The logging system is already integrated into your application. When you start the server, you'll see beautiful colored logs like:

```
2024-01-15 10:30:15 🗄️  MongoDB connected successfully
2024-01-15 10:30:15 🚀 Server is running on port 3000
2024-01-15 10:30:15 📡 Starting news fetch scheduler...
2024-01-15 10:30:15 ✅ News fetch scheduler started successfully
```

## HTTP Request Logging

All API requests are automatically logged with Morgan middleware:

```
2024-01-15 10:30:20 GET /api/rssUrl 200 45ms - 1024 bytes
2024-01-15 10:30:25 POST /api/rssUrl 201 120ms - 512 bytes
```

- **Green methods**: GET, POST, PUT, DELETE, PATCH
- **Colored status codes**: Green (2xx), Yellow (4xx), Red (5xx)
- **Response time**: Green (<100ms), Yellow (100-500ms), Red (>500ms)

## Available Logging Functions

### Basic Logging

```typescript
import { logInfo, logError, logWarn, logSuccess, logDebug } from './utils/logger';

logInfo('📝 Information message');
logSuccess('✅ Success message');
logWarn('⚠️ Warning message');
logError('❌ Error message');
logDebug('🔍 Debug message');
```

### Database Logging

```typescript
import { logDb } from './utils/logger';

logDb('read', 'users', { count: 150, filter: { active: true } });
logDb('insert', 'articles', { count: 25, category: 'technology' });
logDb('update', 'profiles', { userId: 123, changes: ['email', 'avatar'] });
```

### API Request Logging

```typescript
import { logApiRequest } from './utils/logger';

logApiRequest('GET', '/api/users', 200, 45, 'Mozilla/5.0...');
logApiRequest('POST', '/api/articles', 201, 120, 'PostmanRuntime/7.0...');
```

### Performance Logging

```typescript
import { logPerformance } from './utils/logger';

logPerformance('Database query', 45);
logPerformance('External API call', 250);
logPerformance('File processing', 1200);
```

### Error Logging with Stack Traces

```typescript
import { logErrorWithStack } from './utils/logger';

try {
  // Some operation
} catch (error) {
  logErrorWithStack('Operation failed', error, { context: 'user-service' });
}
```

## Log Levels

The system supports multiple log levels with different colors:

- **ERROR** (🔴 Red): Critical errors and exceptions
- **WARN** (🟡 Yellow): Warning messages
- **INFO** (🔵 Blue): General information
- **DEBUG** (⚪ Gray): Debug information
- **SUCCESS** (🟢 Green): Success messages
- **HTTP** (🟣 Magenta): HTTP request logs

## Configuration

### Environment Variables

Set the log level using the `LOG_LEVEL` environment variable:

```bash
LOG_LEVEL=debug  # Shows all log levels
LOG_LEVEL=info   # Shows info, warn, and error (default)
LOG_LEVEL=warn   # Shows only warn and error
LOG_LEVEL=error  # Shows only errors
```

### File Logging

Logs are automatically saved to files in the `logs/` directory:

- `logs/error.log` - Only error messages
- `logs/combined.log` - All log messages

## Integration Examples

### Express Middleware

```typescript
import { morganMiddleware } from './utils/logger';

app.use(morganMiddleware); // Add before your routes
```

### Error Handling

```typescript
import { logError } from './utils/logger';

process.on('uncaughtException', (error) => {
  logError('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError('💥 Unhandled Rejection at:', reason, { promise });
  process.exit(1);
});
```

### Database Operations

```typescript
import { logDb } from './utils/logger';

// In your database service
const users = await User.find({ active: true });
logDb('read', 'users', { count: users.length, filter: { active: true } });
```

## Testing the Logger

Run the test script to see all logging features in action:

```bash
node test-logger.js
```

## Best Practices

1. **Use appropriate log levels**: Don't log everything as info
2. **Include context**: Add relevant metadata to your logs
3. **Use emojis**: Make logs more readable and scannable
4. **Handle errors properly**: Always log errors with stack traces
5. **Monitor performance**: Use performance logging for slow operations

## Customization

You can customize the logging system by modifying `src/utils/logger.ts`:

- Add new log levels
- Change colors and formatting
- Add new transport types
- Customize Morgan tokens

## Troubleshooting

### Logs not appearing

- Check your `LOG_LEVEL` environment variable
- Ensure the `logs/` directory exists
- Verify Winston and Morgan are properly installed

### Performance issues

- Set `LOG_LEVEL` to `warn` or `error` in production
- Monitor file sizes in the `logs/` directory
- Consider using log rotation for large applications
