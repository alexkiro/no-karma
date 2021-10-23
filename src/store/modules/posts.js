import LRUCache from "@/lib/LRUCache";

function initialState() {
  return {
    postCache: new LRUCache(5),
  };
}

export default {
  strict: true,
  state: initialState(),
  mutations: {
    clearPosts(state) {
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
    },
    cachePost(state, post) {
      state.postCache.add(post.id, post);
    },
  },
  getters: {
    postCache(state) {
      return state.postCache;
    },
  },
};
