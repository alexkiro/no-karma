export default {
  strict: true,
  state: {
    locales: {
      relTime: null,
      shortRelTime: null,
      longDateTime: null,
    },
  },
  mutations: {
    setLocales(state, locales) {
      state.locales = locales;
    },
  },
  actions: {
    initLocales(context, locale = "en") {
      const localeMatcher = "best fit";
      const newLocales = {
        relTime: new Intl.RelativeTimeFormat(locale, {
          localeMatcher,
          numeric: "always",
          style: "long",
        }),
        shortRelTime: new Intl.RelativeTimeFormat(locale, {
          localeMatcher,
          numeric: "always",
          style: "short",
        }),
        longDateTime: new Intl.DateTimeFormat(locale, {
          dateStyle: "long",
          timeStyle: "short",
        }),
      };
      context.commit("setLocales", newLocales);
    },
  },
  getters: {
    locales(state) {
      return state.locales;
    },
  },
};
