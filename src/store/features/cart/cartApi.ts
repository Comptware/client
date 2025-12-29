//src/store/features/cartSlice.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { ProductsResponse, Cart, AsicSpec, ProductTypes } from '@/types';
import { baseQueryWithGlobalErrorHandler } from '../../apiBase';
import { detectUserCountry } from '@/utils/detectCurrency';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithGlobalErrorHandler,
  tagTypes: ['Products', 'Cart'],
  endpoints: (builder) => ({
  getProducts: builder.query<ProductsResponse, void>({
  async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
    try {
      const { country } = await detectUserCountry();
      console.log(country,'country===')

      const result = await baseQuery(`/cart/products?country=${country}`);

      if (result.error) return { error: result.error };
      return { data: result.data as ProductsResponse };
    } catch (err: any) {
      console.error('getProducts failed before hitting API:', err);
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: err.message ?? 'Failed to detect user country',
        },
      };
    }
  },
  providesTags: ['Products'],
}),

    getCart: builder.query<Cart, void>({
      query: () => `/cart`,
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<Cart, { productType: ProductTypes; quantity: number; country:string; currency: string; asicSpec?: AsicSpec }>(
      {
        query: (body) => ({
          url: '/cart/add',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Cart'],
      }
    ),

    updateCartItem: builder.mutation<Cart, { productType: ProductTypes; quantity: number; asicSpec?: AsicSpec }>(
      {
        query: (body) => ({
          url: '/cart/update',
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['Cart'],
      }
    ),

    removeCartItem: builder.mutation<Cart, { productType: ProductTypes; asicSpec?: AsicSpec }>(
      {
        query: (body) => ({
          url: '/cart/remove',
          method: 'DELETE',
          body,
        }),
        invalidatesTags: ['Cart'],
      }
    ),

    clearCart: builder.mutation<Cart, void>({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;