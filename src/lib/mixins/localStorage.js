/**
 * Convenience methods, as people will have LocalStorage disable, and
 * we don't want the app to crash in those cases.
 */
export default {
  methods: {
    getLocalStorage(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        // pass
      }
    },
    setLocalStorage(key, value) {
      try {
        return window.localStorage.setItem(key, value);
      } catch (e) {
        // pass
      }
    },
  },
};
