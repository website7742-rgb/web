/**
 * Enterprise Custom Error Hierarchy
 * Standardizes all application faults, ensuring raw DB errors never leak to the client,
 * and correlation IDs (traceId) are firmly attached to every stack trace.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly traceId: string;

  constructor(message: string, statusCode: number, traceId: string, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.traceId = traceId;
    
    // Capture stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly validationErrors?: Record<string, string[]>;

  constructor(message: string, traceId: string, validationErrors?: Record<string, string[]>) {
    super(message, 400, traceId);
    this.validationErrors = validationErrors;
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden: Insufficient Clearance', traceId: string) {
    super(message, 403, traceId);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found', traceId: string) {
    super(message, 404, traceId);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected internal error occurred.', traceId: string) {
    super(message, 500, traceId, false);
  }
}
