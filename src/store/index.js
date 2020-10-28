import Vue from "vue";
import Vuex from "vuex";

import api from "@/store/modules/api";
import env from "@/store/modules/env";
import user from "@/store/modules/user";
import subreddits from "@/store/modules/subreddits";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {},
  mutations: {},
  actions: {
    async initStore(context) {
      // Env data always needs to be loaded first!
      await context.dispatch("loadEnvConfig");

      // Load user data
      await context.dispatch("getMe");
      context.dispatch("loadRSubs");
    },
  },
  modules: {
    env,
    api,
    user,
    subreddits,
  },
});
