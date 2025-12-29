  //  //src/api/client.ts KYC & other APIs will be moved to RTK later
import axios from 'axios';
import { store } from '@/store/store';
import { KycSubmitPayload, KycSubmitResponse, GetCurrentUserResponse } from '@/types';
import { OrderDetailResponse, OrdersListResponse } from '@/types/orders';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

/* ---------- Request interceptor: attach token ---------- */
axiosInstance.interceptors.request.use(async (config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- Response interceptor: normalize server errors ---------- */
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    let message = err.response?.data?.message;
    if (message == null) {
      const status = err.response?.status || '';
      const statusText = err.response?.statusText || '';
      message = `${status} ${statusText}`.trim();
    }
    if (!message) {
      message = err.message;
    }

    return Promise.reject(new Error(message));
  }
);

/* ---------- API helpers ---------- */

// 🔹 Get user + cart (used in dashboard)
export const getCurrentUserWithCart = async (
  token?: string
): Promise<GetCurrentUserResponse> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axiosInstance.get('/auth/me?includeCart=true', { headers });
  return response.data as GetCurrentUserResponse;
};


export const getKYCStatus = async () => {
  const response = await axiosInstance.get('/kyc/status');
  return response.data;
};

export const submitKYC = async (data: KycSubmitPayload): Promise<KycSubmitResponse> => {
  const response = await axiosInstance.post<KycSubmitResponse>('/kyc/start', data);
  return response.data;
};

export const submitKycView = async (data: { scanRef: string; status: 'success' | 'error' }) => {
  const response = await axiosInstance.post('/kyc/track-kyc-completion', data);
  return response.data;
};

export const getMiningDashboard = async () => {
  const response = await axiosInstance.get('/mining/dashboard');
  return response.data;
};

export const getMarketBtcPrice = async () => {
  const response = await axiosInstance.get('/market/btc-price');
  return response.data;
};

export const getOrders = async (): Promise<OrdersListResponse> => {
  const response = await axiosInstance.get('/orders');
  return response.data as OrdersListResponse;
};

export const getOrderById = async (orderId: string): Promise<OrderDetailResponse> => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data as OrderDetailResponse;
};

export const downloadSamplePDF = async (): Promise<Blob> => {
  const response = await axios.get<Blob>(
    "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
    {
      responseType: "blob",
    }
  );

  return response.data;
};
