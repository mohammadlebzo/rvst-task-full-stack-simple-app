import type { Product } from './product.types';

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  productId: string;
  quantity: number;
}
