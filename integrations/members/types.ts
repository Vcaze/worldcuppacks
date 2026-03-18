/**
 * Member type - represents a user stored in the backend.
 */
export type Member = {
  _id: string;
  email: string;
  firstName?: string;
  role?: string;
  balance?: number;
  packsRemaining?: number;
  collectedCards?: any[];
  collectedCardIds?: number[];
};