import { AsyncLocalStorage } from 'node:async_hooks';
import fastRedact from 'fast-redact';

// AsyncLocalStorage for Trace ID Prop Drilling mitigation
export const asyncContext = new AsyncLocalStorage<Map<string, string>>();

const redact = fastRedact({
  paths: [
    'password', 'token', 'jwt', 'secret', 'authorization', 'cookie', 
    'api_key', 'access_token', 'refresh_token', 'credit_card', 'ssn', 
    '*.password', '*.token', '*.jwt', '*.secret'
  ],
  censor: '[REDACTED]'
});

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Enterprise Structured Logger
 * Non-blocking event-loop architecture utilizing fast-redact for extreme speed.
 * Reads traceId dynamically from AsyncLocalStorage to eliminate prop drilling.
 */
class EnterpriseLogger {
  private format(level: LogLevel, message: string, context: Record<string, any> = {}) {
    const timestamp = new Date().toISOString();
    
    // Retrieve Trace ID dynamically
    const store = asyncContext.getStore();
    const traceId = store?.get('traceId') || 'NO-TRACE-ID';
    
    try {
       const payload = {
         level: level.toUpperCase(),
         timestamp,
         message,
         traceId,
         context,
         env: process.env.NODE_ENV || 'development'
       };
       
       // fast-redact natively outputs a JSON string without blocking the event loop on massive trees
       const finalStr = redact(payload) as string;
       
       if (process.env.NODE_ENV === 'development') {
          const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m';
          console.log(`${color}[${level.toUpperCase()}] ${timestamp} [${traceId}]\x1b[0m ${message}`);
          if (Object.keys(context).length > 0) {
            console.log(redact(context)); 
          }
       } else {
          // Production NDJSON output
          if (level === 'error') {
            console.error(finalStr);
          } else {
            console.log(finalStr);
          }
       }
    } catch (err) {
       console.error(`[LOGGER_FAULT] Failed to log message safely: ${message}`);
    }
  }

  info(message: string, context?: Record<string, any>) { this.format('info', message, context); }
  warn(message: string, context?: Record<string, any>) { this.format('warn', message, context); }
  error(message: string, context?: Record<string, any>) { this.format('error', message, context); }
  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') this.format('debug', message, context);
  }
}

export const logger = new EnterpriseLogger();
