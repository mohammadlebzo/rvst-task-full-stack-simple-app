import axios, { AxiosError } from 'axios';
import { PRODUCT_SERVICE_URL, ORDER_SERVICE_URL } from './config';
import type { Product, CreateProductDto, UpdateProductDto } from 'common/types/product.types';
import type { Order, CreateOrderDto } from 'common/types/order.types';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string[];
  timestamp: string;
  path: string;
}

// Helper to extract error message
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response?.data?.message) {
      const messages = axiosError.response.data.message;
      return Array.isArray(messages) ? messages.join(', ') : messages;
    }
    
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Create axios instances for each service
const productApi = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const orderApi = axios.create({
  baseURL: ORDER_SERVICE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Add response interceptor for error handling
[productApi, orderApi].forEach(api => {
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      // Handle specific error codes
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.error('Network error - service may be down:', error.config?.baseURL);
      }
      
      if (error.response) {
        // Server responded with error status
        console.error('API Error:', {
          status: error.response.status,
          message: error.response.data?.message,
          path: error.response.data?.path,
        });
      }
      
      return Promise.reject(error);
    }
  );
});

// ============= PRODUCTS API =============
export async function fetchProducts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Product>> {
  const { data } = await productApi.get<PaginatedResponse<Product>>('/products', {
    params: { page, limit },
  });
  return data;
}

export async function createProduct(productData: CreateProductDto): Promise<Product> {
  const { data } = await productApi.post<Product>('/products', productData);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await productApi.delete(`/products/${id}`);
}

// ============= ORDERS API =============
export async function fetchOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> {
  const { data } = await orderApi.get<PaginatedResponse<Order>>('/orders', {
    params: { page, limit },
  });
  return data;
}

export async function createOrder(orderData: CreateOrderDto): Promise<Order> {
  const { data } = await orderApi.post<Order>('/orders', orderData);
  return data;
}
