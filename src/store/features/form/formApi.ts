import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithGlobalErrorHandler } from '../../apiBase';
import type { FormData } from './formSlice';

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: baseQueryWithGlobalErrorHandler,
  endpoints: (builder) => ({
    submitForm: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: '/submit',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubmitFormMutation } = formApi;