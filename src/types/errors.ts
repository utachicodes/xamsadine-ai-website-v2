/**
 * Common error types for the application
 */

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: unknown;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as ApiError).error === 'string'
  );
}

export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.message || error.error || fallback;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}

