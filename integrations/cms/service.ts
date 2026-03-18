import { WixDataItem } from ".";

/**
 * Pagination options for querying collections
 */
export interface PaginationOptions {
  /** Number of items per page (default: 50, max: 1000) */
  limit?: number;
  /** Number of items to skip (for offset-based pagination) */
  skip?: number;
}

/**
 * Metadata for a multi-reference field (available on item._refMeta[fieldName])
 * Only populated by getById, not getAll
 */
export interface RefFieldMeta {
  /** Total count of referenced items */
  totalCount: number;
  /** Number of items returned */
  returnedCount: number;
  /** Whether there are more items beyond what was returned */
  hasMore: boolean;
}

/**
 * Paginated result with metadata for infinite scroll
 */
export interface PaginatedResult<T> {
  /** Array of items for current page */
  items: T[];
  /** Total number of items in the collection */
  totalCount: number;
  /** Whether there are more items after current page */
  hasNext: boolean;
  /** Current page number (0-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Offset to use for next page */
  nextSkip: number | null;
}

/**
 * Mock CRUD Service class for data collections.
 * 
 * IMPORTANT: This is a stub implementation since Wix has been removed.
 * Replace with your own data backend solution:
 * - REST API
 * - GraphQL
 * - Database (MongoDB, PostgreSQL, etc.)
 * - Firebase, Supabase, etc.
 */
import { getPlayerCards } from "@/lib/api";

export class BaseCrudService {
  /**
   * Creates a new item in the collection
   * TODO: Implement with your data backend
   */
  static async create<T extends WixDataItem>(
    collectionId: string,
    itemData: Partial<T> | Record<string, unknown>,
    multiReferences?: Record<string, any>
  ): Promise<T> {
    console.warn(`BaseCrudService.create called for ${collectionId} - implement with your data backend`);
    throw new Error(`Not implemented: Replace BaseCrudService with your data backend`);
  }

  /**
   * Retrieves items from the collection with pagination
   */
  static async getAll<T extends WixDataItem>(
    collectionId: string,
    includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    if (collectionId === "playercards") {
      const items = await getPlayerCards();
      return {
        items: items as any,
        totalCount: items.length,
        hasNext: false,
        currentPage: 0,
        pageSize: items.length,
        nextSkip: null,
      };
    }

    console.warn(`BaseCrudService.getAll called for ${collectionId} - implement with your data backend`);
    throw new Error(`Not implemented: Replace BaseCrudService with your data backend`);
  }

  /**
   * Retrieves a single item by ID
   * TODO: Implement with your data backend
   */
  static async getById<T extends WixDataItem>(
    collectionId: string,
    itemId: string,
    includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[]
  ): Promise<T | null> {
    console.warn(`BaseCrudService.getById called for ${collectionId} - implement with your data backend`);
    throw new Error(`Not implemented: Replace BaseCrudService with your data backend`);
  }

  /**
   * Updates an existing item
   * TODO: Implement with your data backend
   */
  static async update<T extends WixDataItem>(collectionId: string, itemData: T): Promise<T> {
    console.warn(`BaseCrudService.update called for ${collectionId} - implement with your data backend`);
    throw new Error(`Not implemented: Replace BaseCrudService with your data backend`);
  }

  /**
   * Deletes an item by ID
   * TODO: Implement with your data backend
   */
  static async delete<T extends WixDataItem>(collectionId: string, itemId: string): Promise<T> {
    console.warn(`BaseCrudService.delete called for ${collectionId} - implement with your data backend`);
    throw new Error(`Not implemented: Replace BaseCrudService with your data backend`);
  }

  /**
   * Adds references to a multi-reference field
   * TODO: Implement with your data backend
   */
  static async addReferences(
    collectionId: string,
    itemId: string,
    references: Record<string, string[]>
  ): Promise<void> {
    console.warn(`BaseCrudService.addReferences called for ${collectionId} - implement with your data backend`);
    throw new Error(`Not implemented: Replace BaseCrudService with your data backend`);
  }

  /**
   * Removes references from a multi-reference field
   * TODO: Implement with your data backend
   */
  static async removeReferences(
    collectionId: string,
    itemId: string,
    references: Record<string, string[]>
  ): Promise<void> {
    console.warn(`BaseCrudService.removeReferences called for ${collectionId} - implement with your data backend`);
    throw new Error(`Not implemented: Replace BaseCrudService with your data backend`);
  }
}
