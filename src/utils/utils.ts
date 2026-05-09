/* =============================================================
   utils.ts — Global Utility Functions
   =============================================================
   Purpose   : Provides foundational utility functions used across the application.
   Used by   : Various UI components
   Depends on: clsx, tailwind-merge
   Notes     : Includes the `cn` function for Tailwind CSS class merging.
   ============================================================= */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn
 * Merges multiple Tailwind CSS classes conditionally while resolving conflicts using tailwind-merge.
 * @param {...ClassValue[]} inputs - An array of class values or conditional class objects.
 * @returns {string} The computed and merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
