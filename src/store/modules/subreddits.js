export default {
  strict: true,
  state: {
    nextParams: {},
    rSubs: [],
  },
  mutations: {
    addRSubs(state, { after, children }) {
      state.rSubs = [...state.rSubs, ...children.map((child) => child.data)];
      // Store next params to load more
      state.nextParams = {
        after,
        count: state.rSubs.length,
      };
    },
  },
  actions: {
    async loadRSubs(context, { limit = 50 } = {}) {
      const response = await context.dispatch("apiCall", {
        method: "GET",
        endpoint: "/subreddits/mine/subscriber",
        params: {
          ...context.state.nextParams,
          limit,
        },
      });

      context.commit("addRSubs", response.data);
    },
  },
  getters: {
    rSubs(state) {
      return state.rSubs;
    },
  },
};
