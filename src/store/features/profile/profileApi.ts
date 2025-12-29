//src/store/features/cartSlice.ts
import type { UserProfile } from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithGlobalErrorHandler } from '../../apiBase';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, { token: string }>({
      query: ({ token }) => ({
        url: '/account/profile',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['Profile'],
      transformResponse: (response: any, _meta, arg): UserProfile => {
        const backendUser = response.profile ?? {};

        return {
          auth0Id: backendUser._id ?? '', 
          email: backendUser.email ?? '',
          firstName: backendUser.firstName ?? '',
          middleName: backendUser.middleName ?? '',
          lastName: backendUser.lastName ?? '',
          uniqueClientId: backendUser.uniqueClientId ?? '',
          kycStatus: backendUser.kycStatus ?? 'PENDING',
          documents: backendUser.documents ?? '',
          documentNumber: backendUser.documentNumber ?? '',
          dateOfBirth: backendUser.dateOfBirth ?? '',
          phone: backendUser.phone ?? '',
          address: backendUser.address ?? '', // Legacy field
          street: backendUser.address?.street ?? '',
          city: backendUser.address?.city ?? '',
          state: backendUser.address?.state ?? '',
          zip: backendUser.address?.zip ?? '',
          country: backendUser.country ?? '',
          roles: backendUser.roles ?? [],
          permissions: backendUser.permissions ?? [],
          plan: backendUser.plan ?? 'BASIC',
          hasPaid: backendUser.hasPaid ?? false,
          depositPaid: backendUser.depositPaid ?? false,
          hasSigned: backendUser.hasSigned ?? false,
          depositAmount:
            backendUser.depositAmount === 0 ? 1000 : backendUser.depositAmount,
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


    updateUserProfile: builder.mutation<UserProfile, { 
      email?: string; 
      phone?: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    }>(
      {
        query: (body) => ({
          url: '/account/profile',
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['Profile'],
      }
    ),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation
} = profileApi;