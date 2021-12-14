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

export function debounce(func, delay) {
  let timeoutID = null;

  return function () {
    clearTimeout(timeoutID);
    const args = arguments;
    const that = this;

    timeoutID = setTimeout(function () {
      func.apply(that, args);
    }, delay);
  };
}

export function getCookie(key) {
  const found = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("="))
    .find(([name]) => name === key);
  return (found && found[1]) || "";
}
