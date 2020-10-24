export const envConfig = Object.assign({}, process.env);

/**
 * Default API base if nothing is specified in the env file(s).
 *
 * @type {string}
 */
const apiBaseDefault =
  envConfig.NODE_ENV === "development"
    ? `${window.location.protocol}//localhost:8000`
    : `${window.location.protocol}//${window.location.host}`;

/**
 * Backend host
 *
 * @type {string}
 */
export const apiBase = envConfig.VUE_APP_API_HOST
  ? `${window.location.protocol}//${envConfig.VUE_APP_API_HOST}`
  : apiBaseDefault;
