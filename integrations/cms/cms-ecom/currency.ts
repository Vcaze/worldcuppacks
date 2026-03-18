import { create } from 'zustand';

/**
 * Default currency code to use when the site currency is not available.
 */
export const DEFAULT_CURRENCY = 'USD';

/**
 * Formats a numeric amount as a currency string.
 * Uses the browser's locale for proper formatting (symbol placement, decimals).
 *
 * @param amount - The numeric price value
 * @param currencyCode - ISO 4217 currency code (e.g., "USD", "EUR", "ILS")
 * @returns Formatted currency string (e.g., "$99.99", "€99,99", "₪99.99")
 *
 * @example
 * ```typescript
 * import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
 *
 * const { currency } = useCurrency();
 * formatPrice(99.99, currency ?? DEFAULT_CURRENCY) // "$99.99" (or site currency)
 * formatPrice(99.99, 'EUR') // "€99.99" or "99,99 €" depending on locale
 * formatPrice(99.99, 'ILS') // "₪99.99"
 * ```
 */
export function formatPrice(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    // Fallback for invalid currency codes
    console.warn(`Invalid currency code: ${currencyCode}, falling back to ${DEFAULT_CURRENCY}`);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: DEFAULT_CURRENCY,
    }).format(amount);
  }
}

interface CurrencyState {
  currency: string | null;
  isLoading: boolean;
  error: string | null;
  _initialized: boolean;
}

interface CurrencyActions {
  _fetchCurrency: () => Promise<void>;
}

type CurrencyStore = CurrencyState & { actions: CurrencyActions };

/**
 * Zustand store for site currency state.
 * 
 * TODO: Replace with your own currency configuration:
 * - Environment variable
 * - Database
 * - Your backend API
 */
const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  currency: DEFAULT_CURRENCY,
  isLoading: false,
  error: null,
  _initialized: true,

  actions: {
    _fetchCurrency: async () => {
      // TODO: Fetch from your backend/configuration
      if (get()._initialized) return;

      set({ isLoading: true, error: null });
      try {
        // For now, just use the default currency
        set({
          currency: DEFAULT_CURRENCY,
          isLoading: false,
          _initialized: true,
        });
      } catch (error: unknown) {
        console.warn('Failed to fetch currency:', error);
        set({
          currency: DEFAULT_CURRENCY,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch currency',
          _initialized: true,
        });
      }
    },
  },
}));

/**
 * Hook to access site currency for price formatting.
 * No provider needed - works anywhere in the app.
 *
 * @example
 * ```tsx
 * import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
 *
 * const { currency } = useCurrency();
 *
 * // Format price with site currency
 * <span>{formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}</span>
 * ```
 */
export const useCurrency = () => {
  const store = useCurrencyStore();

  // Auto-fetch currency on first use
  if (!store._initialized && !store.isLoading) {
    store.actions._fetchCurrency();
  }

  return {
    /** Site currency code (e.g., "USD", "EUR"), null while loading */
    currency: store.currency,
    /** True while fetching currency */
    isLoading: store.isLoading,
    /** Error message if fetch failed */
    error: store.error,
  };
};
