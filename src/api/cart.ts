import { axiosInstance } from './client';
import { CartResponse, CartItemPayload } from '@/types/cart';

export const fetchCart = () =>
  axiosInstance.get<CartResponse>('/cart').then((r) => r.data);

export const addToCart = (payload: CartItemPayload) =>
  axiosInstance.post<CartResponse>('/cart/add', payload).then((r) => r.data);

export const updateCart = (payload: CartItemPayload) =>
  axiosInstance.put<CartResponse>('/cart/update', payload).then((r) => r.data);

export const removeFromCart = (payload: CartItemPayload) =>
  axiosInstance.delete<CartResponse>('/cart/remove', { data: payload }).then((r) => r.data);

export const clearCart = () =>
  axiosInstance.delete<CartResponse>('/cart/clear').then((r) => r.data);





// // src/api/cart.ts
// import { axiosInstance } from "./client";

// export const fetchCart    = () => axiosInstance.get('/cart').then(r => r.data);
// export const addToCart    = (payload: any) => axiosInstance.post('/cart/add', payload).then(r => r.data);
// export const updateCart   = (payload: any) => axiosInstance.put('/cart/update', payload).then(r => r.data);
// export const removeFromCart = (payload: any) =>
//   axiosInstance.delete('/cart/remove', { data: payload }).then(r => r.data);
// export const clearCart    = () => axiosInstance.delete('/cart/clear').then(r => r.data);
