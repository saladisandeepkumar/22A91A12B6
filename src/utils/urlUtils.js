/**
 * Utility functions for URL Shortener app
 */

const SHORTCODE_LENGTH = 6;
const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRandomShortcode(existingShortcodes) {
  let shortcode;
  do {
    shortcode = '';
    for (let i = 0; i < SHORTCODE_LENGTH; i++) {
      shortcode += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
    }
  } while (existingShortcodes.has(shortcode));
  return shortcode;
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidValidityPeriod(value) {
  return Number.isInteger(value) && value > 0;
}

export function getExpiryDate(minutes) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}
