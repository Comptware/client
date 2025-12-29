// // store/features/geoApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { Country,State, City, KycDocumentType } from '@/types';
import { baseQueryWithGlobalErrorHandler } from '@/store/apiBase';

export const geoApi = createApi({
  reducerPath: 'geoApi',
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ['Geo'],

  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => '/geo/countries',
      providesTags: ['Geo'],
    }),

    getStates: builder.query<State[], string>({
  query: (countryIso: string) => `/geo/countries/${countryIso}/states`,
  providesTags: (
    result, error, 
    countryIso: string) => [
    { type: 'Geo', id: `STATES-${countryIso}` },
  ],
}),

getCities: builder.query<City[], { countryIso: string; stateIso: string }>({
  query: ({ countryIso, stateIso }: { countryIso: string; stateIso: string }) =>
    `/geo/countries/${countryIso}/states/${stateIso}/cities`,
  providesTags: (
    result,
    error,
    { countryIso, stateIso }: { countryIso: string; stateIso: string }
  ) => [{ type: 'Geo', id: `CITIES-${countryIso}-${stateIso}` }],
}),

    // // GET states by country ISO2 code
    // getStates: builder.query<State[], string>({
    //   query: (countryIso) => `/geo/countries/${countryIso}/states`,
    //   providesTags: (result, error, countryIso) => [
    //     { type: 'Geo', id: `STATES-${countryIso}` },
    //   ],
    // }),

    // // GET cities by state (and country)
    // getCities: builder.query<City[], { countryIso: string; stateIso: string }>({
    //   query: ({ countryIso, stateIso }) =>
    //     `/geo/countries/${countryIso}/states/${stateIso}/cities`,
    //   providesTags: (result, error, { countryIso, stateIso }) => [
    //     { type: 'Geo', id: `CITIES-${countryIso}-${stateIso}` },
    //   ],
    // }),

    // GET allowed KYC document types
    getKycDocumentTypes: builder.query<KycDocumentType[], void>({
      query: () => '/kyc/document-types',
      providesTags: ['Geo'],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
  useGetKycDocumentTypesQuery,
} = geoApi;