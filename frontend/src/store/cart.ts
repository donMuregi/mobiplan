import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { Cart, CartItem, Product, ProductVariation } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  
  // Actions
  setCart: (cart: Cart | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  
  // API Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, variationId?: number, quantity?: number) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isCartOpen: false,

      setCart: (cart) => set({ cart }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/orders/cart/');
          set({ cart: response.data });
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId, variationId, quantity = 1) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/orders/cart/add/', {
            product_id: productId,
            variation_id: variationId || null,
            quantity,
          });
          set({ cart: response.data.cart, isCartOpen: true });
          return { success: true, message: 'Item added to cart!' };
        } catch (error) {
          console.error('Error adding to cart:', error);
          return { success: false, message: 'Failed to add item to cart' };
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (itemId) => {
        set({ isLoading: true });
        try {
          const response = await api.delete(`/orders/cart/remove/${itemId}/`);
          set({ cart: response.data.cart });
        } catch (error) {
          console.error('Error removing from cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          const response = await api.patch(`/orders/cart/update/${itemId}/`, { quantity });
          set({ cart: response.data.cart });
        } catch (error) {
          console.error('Error updating cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'mobiplan-cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
