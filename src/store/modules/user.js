export default {
  strict: true,
  state: {
    user: {
      id: null,
      name: null,
      icon: null,
    },
  },
  mutations: {
    setUser(state, meResponse) {
      state.user = {
        id: meResponse.id,
        name: meResponse.name,
        icon: meResponse.icon_img,
      };
    },
  },
  actions: {
    async getMe(context) {
      const meResponse = await context.dispatch("apiCall", {
        method: "GET",
        endpoint: "/api/v1/me",
      });
      context.commit("setUser", meResponse);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
};
