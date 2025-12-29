// src/store/features/ror/rorApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithGlobalErrorHandler } from '@/store/apiBase';
import {
  AsicRorSummaryResponse,
  AsicRorDetailsResponse,
  AsicRorTimeframe,
} from '@/types';

export const rorApi = createApi({
  reducerPath: 'rorApi',
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ['AsicRor'],

  endpoints: (builder) => ({
    getAsicRorSummary: builder.query<
      AsicRorSummaryResponse,
      {
        timeframe?: AsicRorTimeframe;
        startDate?: string;
        endDate?: string;
        includeChart?: boolean;
      } | void
    >({
      query: (params) => {
        if (!params) return '/asic/ror/summary';

        const queryParams = new URLSearchParams();
        if (params.timeframe) queryParams.append('timeframe', params.timeframe);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.includeChart !== undefined)
          queryParams.append('includeChart', String(params.includeChart));

        const queryString = queryParams.toString();
        return queryString ? `/asic/ror/summary?${queryString}` : '/asic/ror/summary';
      },
      providesTags: ['AsicRor'],
      transformResponse: (response: AsicRorSummaryResponse) => {
        // If chart is empty, add dummy data
        if (response.data && response.data.items) {
          response.data.items = response.data.items.map((item) => {
            if (!item.chart || item.chart.length === 0) {
              // Add dummy chart data with 12 monthly points
              item.chart = [
                { date: "2025-01-01T00:00:00.000Z", earningsUsd: 70 },
                { date: "2025-02-01T00:00:00.000Z", earningsUsd: 50 },
                { date: "2025-03-01T00:00:00.000Z", earningsUsd: 70 },
                { date: "2025-04-01T00:00:00.000Z", earningsUsd: 60 },
                { date: "2025-05-01T00:00:00.000Z", earningsUsd: 30 },
                { date: "2025-06-01T00:00:00.000Z", earningsUsd: 40 },
                { date: "2025-07-01T00:00:00.000Z", earningsUsd: 0 },
              ];
            }
            return item;
          });
        }
        return response;
      },
    }),

    getAsicRorDetails: builder.query<AsicRorDetailsResponse, string>({
      async queryFn(asicId, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ(`/api/v1/asic/${asicId}/ror`);

        if (result.error) {
          // Return dummy data on error
          const dummyData: AsicRorDetailsResponse = {
            data: {
              summary: {
                client_id: "dummy-client",
                asic_id: asicId,
                asic_model: "Antminer S19 Pro",
                purchase_date: "2024-01-01T00:00:00.000Z",
                purchase_price_usd: 5000,
                total_earnings_usd: 1250,
                current_ror_percentage: 25,
                timeframe: "30d",
                timeframe_range: {
                  start: "2024-11-17T00:00:00.000Z",
                  end: "2024-12-17T00:00:00.000Z",
                },
                timeframe_range_applied: {
                  start: "2024-11-17T00:00:00.000Z",
                  end: "2024-12-17T00:00:00.000Z",
                },
                timeframe_earnings_usd: 250,
                timeframe_ror: 5,
                is_dummy: true,
              },
              chart: [
                { date: "2024-11-17T00:00:00.000Z", earningsUsd: 8 },
                { date: "2024-11-24T00:00:00.000Z", earningsUsd: 10 },
                { date: "2024-12-01T00:00:00.000Z", earningsUsd: 9 },
                { date: "2024-12-08T00:00:00.000Z", earningsUsd: 7 },
                { date: "2024-12-15T00:00:00.000Z", earningsUsd: 6 },
              ],
            },
          };
          return { data: dummyData };
        }

        return { data: result.data as AsicRorDetailsResponse };
      },
      providesTags: (result, error, asicId) => [
        { type: 'AsicRor', id: asicId },
      ],
    }),
  }),
});

export const {
  useGetAsicRorSummaryQuery,
  useGetAsicRorDetailsQuery,
} = rorApi;
