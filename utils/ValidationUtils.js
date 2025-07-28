/**
 * This file contains functions to validate specific data types.
 */

/**
 * Determine if the string is a valid email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid or empty, false otherwise.
 */
export function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Determines if the string is a valid zip code.
 * 
 * This function checks for a 5-digit zip code, optionally followed by a dash or space and 4 more digits.
 * It allows for both formatted and unformatted zip codes.  
 * 
 * @param {string} zip - The zip code as a string of digits with or without formatting. 
 * @returns {boolean} True if the zip code is a valid value. 
 */
export function isValidZip(zip) {
  if (!zip) return true;
  return /^(\d{5})([-\s]?\d{4})?$/.test(zip.trim());
}

/**
 * Determines if the string is a valid US phone number.
 * 
 * @param {string} value  - The phone number as a string of digits with or without formatting.
 * @returns {boolean} True if the phone number is valid or empty, false otherwise.
 */
export function isValidPhoneNumber(value) {
  if (!value) return true;
  return /^(\(\d{3}\)|\d{3})[ .-]?\d{3}[ .-]?\d{4}$/.test(value.trim());
}
