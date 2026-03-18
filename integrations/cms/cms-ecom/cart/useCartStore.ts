import { create } from 'zustand';

/** CMS App ID for catalog references */
const CMS_APP_ID = 'e593b0bd-b783-45b8-97c2-873d42aacaf4';

/** Debounce delay for quantity updates (ms) */
const QUANTITY_DEBOUNCE_MS = 500;

/** Cart item representing a product in the cart */
export interface CartItem {
  /** Server-generated line item ID */
  id: string;
  /** CMS collection ID */
  collectionId: string;
  /** CMS item ID (product ID) */
  itemId: string;
  /** Product name for display */
  name: string;
  /** Item price */
  price: number;
  /** Quantity in cart */
  quantity: number;
  /** Product image URL */
  image?: string;
}

/** Input for adding items to cart */
export interface AddToCartInput {
  collectionId: string;
  itemId: string;
  quantity?: number;
}

interface CartState {
  // State
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  addingItemId: string | null;
  isCheckingOut: boolean;
  error: string | null;

  // Internal
  _quantityTimers: Map<string, NodeJS.Timeout>;
  _initialized: boolean;
}

interface CartActions {
  // Public actions
  addToCart: (input: AddToCartInput) => Promise<void>;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Internal
  _fetchCart: () => Promise<void>;
  _sendQuantityUpdate: (lineItemId: string, quantity: number) => Promise<void>;
}

type CartStore = CartState & { actions: CartActions };

/**
 * Zustand store for cart state and actions.
 * 
 * NOTE: This is a client-side only implementation since Wix e-commerce has been removed.
 * For production, implement proper cart persistence with:
 * - LocalStorage
 * - Your backend API
 * - Database storage
 * - Checkout integration with payment provider (Stripe, PayPal, etc.)
 */
export const useCartStore = create<CartStore>((set, get) => ({
  // Initial state
  items: [],
  isOpen: false,
  isLoading: false,
  addingItemId: null,
  isCheckingOut: false,
  error: null,
  _quantityTimers: new Map(),
  _initialized: false,

  actions: {
    /** Fetch cart from storage/server */
    _fetchCart: async () => {
      // Only fetch once on first use
      if (get()._initialized) return;

      set({ isLoading: true, error: null });
      try {
        // TODO: Replace with your backend API call to fetch cart
        // For now, just load from localStorage as example
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('cart');
          const items = stored ? JSON.parse(stored) : [];
          set({
            items,
            isLoading: false,
            _initialized: true,
          });
        }
      } catch (error: unknown) {
        console.warn('Failed to fetch cart:', error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch cart',
          _initialized: true,
        });
      }
    },

    /** Add item to cart */
    addToCart: async (input: AddToCartInput) => {
      set({ addingItemId: input.itemId, error: null });

      try {
        const { items } = get();
        const existingItem = items.find(i => i.itemId === input.itemId);

        if (existingItem) {
          existingItem.quantity += input.quantity || 1;
          set({ items: [...items] });
        } else {
          const newItem: CartItem = {
            id: `${input.itemId}-${Date.now()}`,
            collectionId: input.collectionId,
            itemId: input.itemId,
            name: 'Product',
            price: 0,
            quantity: input.quantity || 1,
          };
          set({ items: [...items, newItem] });
        }

        // TODO: Persist to backend/localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(get().items));
        }
      } catch (error: unknown) {
        console.error('Add to cart failed:', error);
        set({ error: error instanceof Error ? error.message : 'Failed to add to cart' });
      } finally {
        set({ addingItemId: null });
      }
    },

    /** Remove item from cart */
    removeFromCart: (item: CartItem) => {
      const { items, _quantityTimers } = get();

      // Clear any pending quantity update for this item
      const timer = _quantityTimers.get(item.id);
      if (timer) {
        clearTimeout(timer);
        _quantityTimers.delete(item.id);
      }

      // Remove item
      const updated = items.filter(i => i.id !== item.id);
      set({ items: updated });

      // Persist
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updated));
      }
    },

    /** Internal: send quantity update to storage */
    _sendQuantityUpdate: async (lineItemId: string, quantity: number) => {
      try {
        const { items } = get();
        
        if (quantity <= 0) {
          set({ items: items.filter(i => i.id !== lineItemId) });
        } else {
          set({
            items: items.map(i => i.id === lineItemId ? { ...i, quantity } : i),
          });
        }

        // Persist
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(get().items));
        }
      } catch (error) {
        console.error('Update quantity failed:', error);
      }
    },

    /** Update quantity - with debouncing */
    updateQuantity: (item: CartItem, quantity: number) => {
      const { items, _quantityTimers, actions } = get();

      // Optimistic update
      if (quantity <= 0) {
        set({ items: items.filter(i => i.id !== item.id) });
      } else {
        set({
          items: items.map(i => i.id === item.id ? { ...i, quantity } : i),
        });
      }

      // Debounce persistence
      const existingTimer = _quantityTimers.get(item.id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        _quantityTimers.delete(item.id);
        actions._sendQuantityUpdate(item.id, quantity);
      }, QUANTITY_DEBOUNCE_MS);

      _quantityTimers.set(item.id, timer);
    },

    /** Clear all items from cart */
    clearCart: () => {
      const { _quantityTimers } = get();

      // Clear all pending quantity updates
      _quantityTimers.forEach(timer => clearTimeout(timer));
      _quantityTimers.clear();

      // Clear items
      set({ items: [] });

      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },

    /** Checkout - TODO: Implement payment processing */
    checkout: async () => {
      set({ isCheckingOut: true, error: null });

      try {
        // TODO: Implement checkout with your payment provider:
        // - Stripe
        // - PayPal
        // - Square
        // - Custom backend API
        throw new Error('Checkout not implemented - connect your payment provider');
      } catch (error: unknown) {
        console.error('Checkout failed:', error);
        set({
          error: error instanceof Error ? error.message : 'Checkout failed',
          isCheckingOut: false,
        });
      }
    },

    /** Toggle cart drawer */
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    /** Open cart drawer */
    openCart: () => set({ isOpen: true }),

    /** Close cart drawer */
    closeCart: () => set({ isOpen: false }),
  },
}));

/**
 * Hook to access cart state and actions.
 * No provider needed - works anywhere in the app.
 *
 * For currency formatting, use the separate `useCurrency()` hook.
 *
 * @example
 * ```tsx
 * import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
 *
 * const { items, addingItemId, actions } = useCart();
 * const { currency } = useCurrency();
 *
 * // Format price with site currency
 * <span>{formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}</span>
 *
 * // Add item (shows loading only on this button)
 * <Button
 *   disabled={addingItemId === item._id}
 *   onClick={() => actions.addToCart({ collectionId: 'x', itemId: item._id })}
 * >
 *   {addingItemId === item._id ? 'Adding...' : 'Add to Cart'}
 * </Button>
 * ```
 */
export const useCart = () => {
  const store = useCartStore();

  // Auto-fetch cart on first use
  if (!store._initialized && !store.isLoading) {
    store.actions._fetchCart();
  }

  // Computed values
  const itemCount = store.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = store.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    // State
    items: store.items,
    itemCount,
    totalPrice,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    addingItemId: store.addingItemId,
    isCheckingOut: store.isCheckingOut,
    error: store.error,
    // Actions
    actions: store.actions,
  };
};
