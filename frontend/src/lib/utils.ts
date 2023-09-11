import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single class string using `clsx`
 * and then merges Tailwind CSS classes using `twMerge`.
 *
 * @param inputs - The class values to be combined.
 * @returns A string containing merged class values.
 */
export function cn(...inputs: ClassValue[]): string {
    const combinedClasses = clsx(inputs);
    const mergedClasses = twMerge(combinedClasses);
    return mergedClasses;
}

/**
 * Generates initials from a given name by taking the first letter of each word.
 *
 * @param name - The input name from which to generate initials.
 * @returns The initials generated from the input name.
 */
export function getInitials(name: string): string {
    const words = name.trim().split(' ');
    const initials = words.map(word => word[0].toUpperCase()).join('').slice(0, 2);
    return initials;
}

/**
 * Slugify a string by replacing spaces and special characters with hyphens
 * and converting the string to lowercase.
 *
 * @param {String} input - The input string to slugify.
 * @returns {String} The slugified string.
 */
export function slugify(input: string) {
    // Remove special characters and replace spaces with hyphens
    const slug = input
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  
    return slug;
  }
