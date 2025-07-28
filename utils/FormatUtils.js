/**
 * Utility functions for formatting of various data types.
 */

/**
 * Format a string of digits (or any phone input) as (999) 999-9999 if 10 digits are present.
 * Otherwise, return the original value.
 * @param {string} value
 * @returns {string}
 */
export function formatPhoneNumber(value) {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value || "";
}
