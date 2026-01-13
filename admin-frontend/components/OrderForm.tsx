'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchProducts, createOrder, getErrorMessage } from '@/lib/api';
import type { CreateOrderDto } from 'common/types/order.types';

export default function OrderForm() {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const queryClient = useQueryClient();

  const { data, isLoading: loadingProducts, error: productsError } = useQuery({
    queryKey: ['products', 1, 100],
    queryFn: () => fetchProducts(1, 100),
  });

  const products = data?.data || [];

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Reset form
      setSelectedProductId('');
      setQuantity('1');
      // Invalidate both products (for stock update) and orders
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Show success toast
      toast.success('Order created successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset(); // Clear any previous errors

    const data: CreateOrderDto = {
      productId: selectedProductId,
      quantity: parseInt(quantity),
    };

    mutate(data);
  };

  if (loadingProducts) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800">Create New Order</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          <p className="font-medium">Failed to create order</p>
          <p className="text-sm mt-1">{getErrorMessage(error)}</p>
        </div>
      )}

      {productsError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          <p className="font-medium">Failed to load products</p>
          <p className="text-sm mt-1">{getErrorMessage(productsError)}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No products available. Please create a product first in the Products tab.
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
              Select Product *
            </label>
            <select
              id="product"
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">-- Choose a product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price.toFixed(2)} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <h3 className="font-medium text-gray-800 mb-2">Product Details</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {selectedProduct.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Price:</span> ${selectedProduct.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Available Stock:</span> {selectedProduct.stock}
              </p>
              {quantity && (
                <p className="text-sm text-gray-800 mt-2 font-semibold">
                  Total: ${(selectedProduct.price * parseInt(quantity)).toFixed(2)}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={selectedProduct?.stock || 999999}
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="1"
            />
            {selectedProduct && parseInt(quantity) > selectedProduct.stock && (
              <p className="text-red-600 text-sm mt-1">
                Quantity exceeds available stock ({selectedProduct.stock})
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !selectedProductId || (selectedProduct && parseInt(quantity) > selectedProduct.stock)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating Order...' : 'Create Order'}
          </button>
        </>
      )}
    </form>
  );
}
