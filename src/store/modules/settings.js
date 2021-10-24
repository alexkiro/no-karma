function setLS(key, value) {
  try {
    console.log("SETLS", key, value);
    window.localStorage.setItem(key, value.toString());
  } catch (e) {
    // pass
  }
}

function getLS(context, key, mutation) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      context.commit(mutation, storedValue);
    }
  } catch (e) {
    // pass
  }
}

function boolParse(value) {
  return value.toString() === "true";
}

export default {
  strict: true,
  state: {
    settings: {
      autoplayVideos: false,
      mutedVideos: true,
      showNSFW: false,
      showRedditLinks: false,
    },
  },
  mutations: {
    setAutoplayVideos(state, value) {
      state.settings.autoplayVideos = boolParse(value);
      setLS("autoplayVideos", value);
    },
    setMutedVideos(state, value) {
      state.settings.mutedVideos = boolParse(value);
      setLS("mutedVideos", value);
    },
    setShowNSFW(state, value) {
      state.settings.showNSFW = boolParse(value);
      setLS("showNSFW", value);
    },
    setShowRedditLinks(state, value) {
      state.settings.showRedditLinks = boolParse(value);
      setLS("showRedditLinks", value);
    },
  },
  actions: {
    initUserSettings(context) {
      getLS(context, "autoplayVideos", "setAutoplayVideos");
      getLS(context, "mutedVideos", "setMutedVideos");
      getLS(context, "showNSFW", "setShowNSFW");
      getLS(context, "showRedditLinks", "setShowRedditLinks");
    },
  },
  getters: {
    autoplayVideos(state) {
      return state.settings.autoplayVideos;
    },
    mutedVideos(state) {
      return state.settings.mutedVideos;
    },
    showNSFW(state) {
      return state.settings.showNSFW;
    },
    showRedditLinks(state) {
      return state.settings.showRedditLinks;
    },
  },
};
