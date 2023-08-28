import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  const words = name.trim().split(' ');
  const initials = words.map(word => word[0].toUpperCase()).join('').slice(0, 2);
  return initials;
}