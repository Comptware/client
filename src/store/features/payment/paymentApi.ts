// src/store/features/paymentSlice.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithGlobalErrorHandler } from '../../apiBase';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ['Payment', 'Deposit', 'Invoice'],
  endpoints: (builder) => ({

    // 💳 Create Stripe Deposit Intent
    createDepositIntent: builder.mutation<
      { clientSecret: string },
      void
    >({
      query: () => ({
        url: '/deposit/create-intent',
        method: 'POST',
      }),
      invalidatesTags: ['Deposit'],
    }),

    // 💳 Create Stripe Payment Intent (for balance)
    createPaymentIntent: builder.mutation<
      { clientSecret: string },
      void
    >({
      query: () => ({
        url: '/payments/create-intent',
        method: 'POST',
      }),
      invalidatesTags: ['Payment'],
    }),

    // ₿ Create BitPay Invoice
    createBitpayInvoice: builder.mutation<
      { paymentUrl: string },
      void
    >({
      query: () => ({
        url: '/payments/bitpay-invoice',
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useCreateDepositIntentMutation,
  useCreatePaymentIntentMutation,
  useCreateBitpayInvoiceMutation,
} = paymentApi;
