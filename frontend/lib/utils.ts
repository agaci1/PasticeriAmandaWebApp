import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import API_BASE from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg"
  if (imagePath.startsWith('http')) return imagePath
  if (imagePath.startsWith('blob:')) return imagePath
  return `${API_BASE}${imagePath}`
}
