import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import tippy from "tippy.js";
import locale from "@/lib/mixins/locale";

Vue.config.productionTip = false;

Vue.directive("tippy", {
  inserted: function (el, binding) {
    tippy(el, binding.value);
  },
  update: function (el, binding) {
    tippy(el, binding.value);
  },
});

Vue.mixin(locale);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
