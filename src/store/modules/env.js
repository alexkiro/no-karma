export default {
  strict: true,
  state: {
    envConfig: { ...process.env },
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
    async loadEnvConfig(context) {
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
    apiBaseDefault(state) {
      return state.envConfig.NODE_ENV === "development"
        ? `${window.location.protocol}//localhost:8000`
        : `${window.location.protocol}//${window.location.host}`;
    },
    apiBase(state, getters) {
      return state.envConfig.VUE_APP_API_HOST
        ? `${window.location.protocol}//${state.envConfig.VUE_APP_API_HOST}`
        : getters.apiBaseDefault;
    },
  },
};
