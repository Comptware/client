import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error != null && 'message' in error;
}8

// ✅ Extract a human-readable message
export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    // When backend returns JSON with a message (like { message: 'Unauthorized' })
    const errData = error.data as { message?: string; error?: string } | undefined;
    return errData?.message || errData?.error || `Request failed with status ${error.status}`;
  } else if (isErrorWithMessage(error)) {
    return error.message;
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
}