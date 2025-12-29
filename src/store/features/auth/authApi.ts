import { createApi } from '@reduxjs/toolkit/query/react';
import type { UserProfile } from '@/types';
import { baseQueryWithGlobalErrorHandler } from '../../apiBase';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserProfile, { token: string; auth0Id: string }>({
     
      query: ({ token }) => ({
        url: '/auth/me',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['User'],
      transformResponse: (response: any, _meta, arg): UserProfile => {
        
        const backendUser = response.user ?? {};

        return {
          auth0Id: arg.auth0Id,
          email: backendUser.email ?? '',
          firstName: backendUser.firstName ?? '',
          lastName: backendUser.lastName ?? '',
          kycStatus: backendUser.kycStatus ?? 'PENDING',
          documents: backendUser.documents ?? '',
          documentNumber: backendUser.documentNumber ?? '',
          dateOfBirth: backendUser.dateOfBirth ?? '',
          address: backendUser.address ?? '',
          country: backendUser.country ?? '',
          roles: backendUser.roles ?? [],
          permissions: backendUser.permissions ?? [],
          plan: backendUser.plan ?? 'BASIC',
          hasPaid: backendUser.hasPaid ?? false,
          depositPaid: backendUser.depositPaid ?? false,
          hasSigned: backendUser.hasSigned ?? false,
          depositAmount: backendUser.depositAmount ?? 0,
          // depositAmount:
          //   backendUser.depositAmount === 0 ? 1000 : backendUser.depositAmount,
          status: backendUser.status ?? 'PENDING',
          walletAddress: backendUser.walletAddress ?? '',
          preferences:
            backendUser.preferences ?? {
              notifications: { email: true, sms: false, push: true },
              payoutFrequency: 'MONTHLY',
              currency: 'USD',
            },
        };
      },
    }),
  }),
});

export const { useGetCurrentUserQuery } = authApi;