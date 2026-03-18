/** CMS App ID for catalog references */
const CMS_APP_ID = 'e593b0bd-b783-45b8-97c2-873d42aacaf4';

/**
 * Buy now - skips the cart and goes directly to checkout.
 * 
 * TODO: Implement with your payment provider:
 * - Stripe
 * - PayPal
 * - Square
 * - Custom backend API
 *
 * NOTE: Always show a loading state - this redirects and takes time!
 *
 * @param items - Array of items with collectionId, itemId, and optional quantity
 *
 * @example
 * ```tsx
 * const [isLoading, setIsLoading] = useState(false);
 *
 * const handleBuyNow = async () => {
 *   setIsLoading(true);
 *   try {
 *     await buyNow([{
 *       collectionId: 'products',
 *       itemId: 'product-123',
 *       quantity: 1
 *     }]);
 *   } catch (error) {
 *     // Handle error
 *     console.error(error);
 *     setIsLoading(false);
 *   }
 *   // Note: Page will redirect on success, loading state won't reset
 * };
 * ```
 */
export async function buyNow(
  items: Array<{ collectionId: string; itemId: string; quantity?: number }>
): Promise<void> {
  if (items.length === 0) {
    throw new Error('At least one item is required for checkout');
  }

  // TODO: Create checkout with your payment provider
  throw new Error('buyNow() not implemented - replace with your payment provider');
}
