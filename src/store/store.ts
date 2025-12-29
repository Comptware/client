// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { setupListeners } from '@reduxjs/toolkit/query'
import { pokemonApi } from '../services/pokemon'
import { cartApi } from './features/cart/cartApi'
import { paymentApi } from './features/payment/paymentApi'
import { authApi } from './features/auth/authApi';
import formReducer from './features/form/formSlice';
import { formApi } from './features/form/formApi';
import { projectApi } from './features/tracker/projectApi';
import { geoApi } from './features/geo/geoApi';
import guestCartReducer from './features/cart/guestCartSlice';
import chatReducer from './features/chat/chatSlice';
import { opsApi } from './features/ops/opsApi';
import { profileApi } from './features/profile/profileApi';
import { rorApi } from './features/ror/rorApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    guestCart: guestCartReducer,
    chat: chatReducer,
    [formApi.reducerPath]: formApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [geoApi.reducerPath]: geoApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [opsApi.reducerPath]: opsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [rorApi.reducerPath]: rorApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(pokemonApi.middleware)
      .concat(cartApi.middleware)
      .concat(paymentApi.middleware)
      .concat(geoApi.middleware)
      .concat(formApi.middleware)
      .concat(projectApi.middleware)
      .concat(opsApi.middleware)
      .concat(profileApi.middleware)
      .concat(rorApi.middleware)
});

// console.log('Initial state===', store.getState());

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;