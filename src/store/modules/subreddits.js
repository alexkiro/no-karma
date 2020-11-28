function initialState() {
  return {
    nextParams: {},
    rSubs: [],
  };
}

export default {
  strict: true,
  state: initialState(),
  mutations: {
    clearRSubs(state) {
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
    },
    addRSubs(state, { after, children }) {
      // TODO: don't store unnecessary data.
      state.rSubs = [...state.rSubs, ...children.map((child) => child.data)];
      // Store next params to load more
      state.nextParams = {
        after,
        count: state.rSubs.length,
      };
    },
  },
  actions: {
    // TODO: Add defaults subs for anon
    async loadRSubs(context, { limit = 100 } = {}) {
      const response = await context.dispatch("apiCall", {
        method: "GET",
        endpoint: "/subreddits/mine/subscriber",
        params: {
          ...context.state.nextParams,
          limit,
        },
      });
      if (response.data) {
        context.commit("addRSubs", response.data);
      }
    },
  },
  getters: {
    rSubs(state) {
      return state.rSubs;
    },
  },
};
