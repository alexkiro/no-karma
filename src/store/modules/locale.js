export default {
  strict: true,
  state: {
    relativeTimeFormat: null,
  },
  mutations: {
    setRelativeTimeFormat(state, fmt) {
      state.relativeTimeFormat = fmt;
    },
  },
  actions: {
    initLocales(context, locale = "en") {
      context.commit(
        "setRelativeTimeFormat",
        new Intl.RelativeTimeFormat(locale, {
          localeMatcher: "best fit",
          numeric: "always",
          style: "long",
        })
      );
    },
  },
  getters: {
    relativeTimeFormat(state) {
      return state.relativeTimeFormat;
    },
  },
};
