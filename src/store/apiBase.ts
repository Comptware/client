//src/store/apiBase.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getErrorMessage } from '@/services/api/helpers';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { toast } from 'react-toastify';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API!;

// ⚙️ Step 1: Define normal base query
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.auth?.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

// ⚡ Step 2: Wrap it to handle errors globally
export const baseQueryWithGlobalErrorHandler: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const message = getErrorMessage(result.error);

    // ✅ Show global toast
    toast.error(message, { toastId: 'global-api-error' });

    // 🔁 Optional: handle logout on 401
    if (result.error.status === 401) {
      // api.dispatch(logout());
    }
  }

  return result;
};