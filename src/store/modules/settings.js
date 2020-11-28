function setLS(key, value) {
  try {
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

export default {
  strict: true,
  state: {
    settings: {
      autoplayVideos: false,
      mutedVideos: true,
    },
  },
  mutations: {
    setAutoplayVideos(state, value) {
      state.settings.autoplayVideos = value;
      setLS("autoplayVideos", value);
    },
    setMutedVideos(state, value) {
      state.settings.mutedVideos = value;
      setLS("mutedVideos", value);
    },
  },
  actions: {
    initUserSettings(context) {
      getLS(context, "autoplayVideos", "setAutoplayVideos");
      getLS(context, "mutedVideos", "setMutedVideos");
    },
  },
  getters: {
    autoplayVideos(state) {
      return state.settings.autoplayVideos;
    },
    mutedVideos(state) {
      return state.settings.mutedVideos;
    },
  },
};