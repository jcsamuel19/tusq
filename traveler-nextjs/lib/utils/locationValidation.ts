/**
 * Location validation utility
 * Validates if input is a valid zip code or city/landmark name
 */

export function isValidLocation(input: string): boolean {
  const trimmed = input.trim();
  
  // Check for 5-digit zip code
  if (/^\d{5}$/.test(trimmed)) {
    return true;
  }
  
  // Check for city/landmark: 2-50 chars, alphanumeric with common punctuation
  if (
    /^[a-zA-Z0-9\s\-',.]+$/.test(trimmed) &&
    trimmed.length >= 2 &&
    trimmed.length <= 50
  ) {
    return true;
  }
  
  return false;
}

