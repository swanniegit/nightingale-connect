import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
