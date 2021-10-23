import Vue from "vue";
import Vuex from "vuex";

import api from "@/store/modules/api";
import env from "@/store/modules/env";
import user from "@/store/modules/user";
import posts from "@/store/modules/posts";
import subreddits from "@/store/modules/subreddits";
import locale from "@/store/modules/locale";
import settings from "@/store/modules/settings";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {},
  mutations: {},
  actions: {
    async initStore(context) {
      // Env data always needs to be loaded first!
      await Promise.all([
        context.dispatch("loadEnvConfig"),
        context.dispatch("initLocales"),
        context.dispatch("initUserSettings"),
      ]);

      // Load user data
      try {
        await context.dispatch("getMe");
      } catch (e) {
        switch (e.statusCode) {
          case 401:
          case 403:
            await context.dispatch("logout");
            break;
          default:
            throw e;
        }
      }
      context.dispatch("loadRSubs");
    },
    /**
     * Clear current state. Use this to avoid weirdness when switching between users.
     *
     * @param context
     */
    clearStore(context) {
      context.commit("clearUser");
      context.commit("clearPosts");
      context.commit("clearRSubs");
    },
  },
  modules: {
    env,
    api,
    user,
    posts,
    locale,
    settings,
    subreddits,
  },
});
