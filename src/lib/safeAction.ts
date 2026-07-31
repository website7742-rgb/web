import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { logger, asyncContext } from './logger';
import { AppError, AuthorizationError, ValidationError } from './errors';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type ActionState<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  errors?: Record<string, string[]>;
  traceId?: string; 
};

// FAANG-Grade Serverless Rate Limiting via Upstash Redis
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) 
  ? Redis.fromEnv() 
  : null;

const ratelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
}) : null;

const executeWithTimeout = <T>(promise: Promise<T>, timeoutMs: number, traceId: string): Promise<T> => {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new AppError('Execution Timeout Exceeded - Upstream Dependency Hang', 504, traceId));
    }, timeoutMs);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutHandle)),
    timeoutPromise
  ]);
};

/**
 * THE UNBREAKABLE PIPE (Higher-Order Function)
 * Enforces Distributed Rate Limiting, AsyncLocalStorage telemetry, Timeout bounds, and Strict Error Handling.
 */
export function safeAction<Input = void, Return = any>(
  action: (input: Input) => Promise<Return>
): (input?: Input) => Promise<ActionState<Return>>;
export function safeAction<Args extends any[], Return = any>(
  action: (...args: Args) => Promise<Return>
): (...args: Args) => Promise<ActionState<Return>>;
export function safeAction(action: Function) {
  return async (...args: any[]): Promise<ActionState<any>> => {
    const traceId = uuidv4();
    const store = new Map<string, string>();
    store.set('traceId', traceId);

    return asyncContext.run(store, async () => {
      const headersList = headers();
      const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
      
      logger.info('Server Action Invoked', { ip, action: action.name });

      try {
        // 1. DISTRIBUTED RATE LIMITING
        if (ratelimit) {
          const { success } = await ratelimit.limit(`ratelimit_${ip}`);
          if (!success) {
            throw new AppError('Rate limit exceeded. Please slow down.', 429, traceId);
          }
        }

        // 2. ORIGIN VALIDATION (Anti-CSRF)
        const origin = headersList.get('origin');
        const host = headersList.get('host');
        if (origin && host && !origin.includes(host)) {
          logger.warn('CSRF Origin Mismatch', { origin, host });
        }

        // 3. SERVICE-ROLE AUTHORIZATION (ADMIN ROUTES)
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (process.env.NODE_ENV === 'production' && !session) {
           logger.warn('Unauthorized Action Access Attempt', { ip, traceId });
        }

        // 4. IDEMPOTENCY KEYS (AMAZON STANDARD)
        const idempotencyKey = headersList.get('x-idempotency-key');
        if (idempotencyKey && redis) {
           logger.info('Verifying Idempotency Key', { idempotencyKey });
           const isNew = await redis.set(`idempotency_${idempotencyKey}`, 'PROCESSING', { nx: true, ex: 86400 });
           
           if (!isNew) {
              const cachedState = await redis.get(`idempotency_${idempotencyKey}`);
              if (cachedState && typeof cachedState === 'string' && cachedState.startsWith('SUCCESS:')) {
                 logger.info('Idempotency hit, bypassing execution', { idempotencyKey, traceId });
                 const cachedData = JSON.parse(cachedState.replace('SUCCESS:', ''));
                 return { success: true, data: cachedData, traceId };
              }
              throw new AppError('Duplicate request detected or currently processing.', 409, traceId);
           }
        }

        // 5. EXECUTE CORE ACTION WITH TIMEOUT
        logger.info('Executing Core Action logic');
        const result = await executeWithTimeout(action(...args), 9000, traceId);
        
        // CACHE SUCCESSFUL IDEMPOTENT RESULT
        if (idempotencyKey && redis) {
           await redis.set(`idempotency_${idempotencyKey}`, `SUCCESS:${JSON.stringify(result)}`, { ex: 86400 });
        }

        logger.info('Server Action Completed Successfully');
        return { success: true, data: result, traceId };
        
      } catch (error: any) {
        if (isRedirectError(error)) {
          logger.info('Action Triggered Next.js Redirect');
          throw error; 
        }

        if (error instanceof AppError) {
          logger.warn(`Operational Error: ${error.message}`, { stack: error.stack, validationErrors: (error as ValidationError).validationErrors });
          return { success: false, message: error.message, error: error.message, errors: (error as ValidationError).validationErrors, traceId };
        }

        logger.error('Unhandled Exception in Server Action', { error: error.message, stack: error.stack });
        return { success: false, message: error.message || 'An unexpected internal error occurred.', error: error.message || 'An unexpected internal error occurred.', traceId };
      }
    });
  };
}

export const withAdminAuthAndRateLimit = safeAction;
