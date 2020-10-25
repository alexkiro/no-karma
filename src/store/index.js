import Vue from "vue";
import Vuex from "vuex";

import env from "./modules/env";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {},
  mutations: {},
  actions: {},
  modules: {
    env,
  },
});
