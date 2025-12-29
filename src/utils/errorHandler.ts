import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ErrorResponse } from '@/types';

interface ErrorHandlerOptions {
  showToast?: boolean; // Whether to show a toast notification
  forUI?: boolean; // Whether the message is for UI display (limits to specific status codes)
}

export function handleError(error: unknown, options: ErrorHandlerOptions = { showToast: true, forUI: false }): string {
  const { showToast, forUI } = options;
  let message = 'An unexpected error occurred. Please try again.';

  if (error instanceof AxiosError && error.response) {
    const errorData: ErrorResponse = error.response.data;
    message = errorData.message || message;

    if (
      (errorData.statusCode === 404 || error.response.status === 404) &&
      errorData.message === 'Route not found'
    ) {
      message = 'Service is currently unavailable. Please try again later.';
    } else if (errorData.statusCode === 500 || error.response.status === 500) {
      message = 'Server error. Please try again later or contact support.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Only return specific messages for UI display (404, 500)
  if (forUI && !message.includes('unavailable') && !message.includes('Server error')) {
    return ''; // Empty string for non-UI errors
  }

  if (showToast) {
    toast.error(message, { position: 'top-right', autoClose: 3000 });
  }

  return message;
}