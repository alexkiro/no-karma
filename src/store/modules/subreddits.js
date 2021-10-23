function initialState() {
  return {
    nextParams: {},
    subscribedSubreddits: {},
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
      const newSubs = {};
      children.forEach((child) => {
        newSubs[child.data.display_name.toLowerCase()] = child.data;
      });

      state.subscribedSubreddits = {
        ...state.subscribedSubreddits,
        ...newSubs,
      };

      if (after) {
        // Store next params to load more
        state.nextParams = {
          after,
          count: Object.keys(state.subscribedSubreddits).length,
        };
      } else {
        state.nextParams = {};
      }
    },
  },
  actions: {
    async loadRSubs(context, { limit = 25 } = {}) {
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
    async getSubRedditDetails(context, subName) {
      subName = subName.toLowerCase();
      const cachedSubDetails = context.getters.subscribedSubreddits.find(
        (sub) => sub.display_name.toLowerCase() === subName
      );
      if (cachedSubDetails) return cachedSubDetails;

      const response = await context.dispatch("apiCall", {
        method: "GET",
        endpoint: `/r/${subName}/about`,
      });
      return response.data;
    },
  },
  getters: {
    subscribedSubreddits(state) {
      return Object.values(state.subscribedSubreddits);
    },
    hasMoreSubscribedSubreddits(state) {
      return !!state.nextParams.after;
    },
  },
};
