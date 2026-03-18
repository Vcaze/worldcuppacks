/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: playercards
 * Interface for PlayerCards
 */
export interface PlayerCards {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** Seed/player numeric ID (from seed-players) */
  id?: number;
  /** @wixFieldType text */
  playerName?: string;
  /** @wixFieldType text */
  teamName?: string;
  /** @wixFieldType text */
  rarityLevel?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  cardImage?: string;
  /** @wixFieldType text */
  playerPosition?: string;
  /** @wixFieldType number */
  overallRating?: number;
}
