export const DEFAULTS = {
  autoplayVideos: false,
  mutedVideos: true,
  showNSFW: false,
  showRedditLinks: false,
  openPostInNewTab: true,
  darkTheme: true,
  drawerMini: false,
};
const ALLOWED = new Set(Object.keys(DEFAULTS));
const LS_KEY = "noKarmaSettings";

export default {
  strict: true,
  state: {
    settings: { ...DEFAULTS },
  },
  mutations: {
    setOption(state, { key, value }) {
      if (!ALLOWED.has(key)) throw Error(`Invalid setting: ${key}`);

      state.settings[key] = value;
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(state.settings));
      } catch (e) {
        // pass
      }
    },
    setSettings(state, newSettings) {
      Object.keys(state.settings).forEach((key) => {
        state.settings[key] = newSettings[key] || state.settings[key];
      });
    },
  },
  actions: {
    initUserSettings(context) {
      try {
        context.commit("setSettings", JSON.parse(localStorage.getItem(LS_KEY)));
      } catch (e) {
        // pass
      }
    },
  },
  getters: {
    ...Object.fromEntries(
      Object.keys(DEFAULTS).map((key) => {
        return [
          key,
          function (state) {
            return state.settings[key];
          },
        ];
      })
    ),
  },
};
