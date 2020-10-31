/**
 * Get UNIX epoch time as an Integer.
 * @returns {number}
 */
export const unixTimestamp = () => Math.floor(Date.now() / 1000);
