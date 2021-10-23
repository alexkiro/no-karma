export default {
  strict: true,
  state: {
    envConfig: {
      ...process.env,
    },
  },
  mutations: {
    updateEnvConfig(state, newEnv) {
      state.envConfig = {
        ...state.envConfig,
        ...newEnv,
      };
    },
  },
  actions: {
    /**
     * Load any critical app information, normally available in process.env
     *
     * @param context
     * @return {Promise<void>}
     */
    async loadEnvConfig(context) {
      if (context.state.envConfig.NODE_ENV !== "production") return;
      try {
        const newEnv = {};
        const response = await fetch("/env.json");
        (await response.json()).forEach(
          ({ key, value }) => (newEnv[key] = value)
        );
        context.commit("updateEnvConfig", newEnv);
      } catch (e) {
        // pass
      }
    },
  },
  getters: {
    /**
     * Default API base if none is specified.
     */
    apiBaseDefault(state) {
      return state.envConfig.NODE_ENV === "development"
        ? `${window.location.protocol}//localhost:8000`
        : `${window.location.protocol}//${window.location.host}`;
    },
    /**
     * Base url for the API
     */
    apiBase(state, getters) {
      return state.envConfig.VUE_APP_API_HOST
        ? `${window.location.protocol}//${state.envConfig.VUE_APP_API_HOST}`
        : getters.apiBaseDefault;
    },
    videoBase(state) {
      return state.envConfig.VUE_APP_VIDEO_HOST;
    },
    avatarBase(state) {
      return `${window.location.protocol}//${state.envConfig.VUE_APP_AVATAR_HOST}`;
    },
  },
};
