/**
 * Get UNIX epoch time as an Integer.
 * @returns {number}
 */
export const unixTimestamp = () => Math.floor(Date.now() / 1000);

/**
 * Remove diacritics from the string.
 *
 * @param str {string}
 * @return {string}
 */
export function unaccent(str) {
  if (!str) return str;
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function includesLax(str, searchString) {
  if (!str) return false;
  return unaccent(str)
    .toLowerCase()
    .includes(unaccent(searchString).toLowerCase());
}
