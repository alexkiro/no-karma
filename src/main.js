import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import locale from "@/lib/mixins/locale";
import vuetify from "./plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import localStorage from "@/lib/mixins/localStorage";

Vue.config.productionTip = false;

/**
 * Directive that hides the visibility of an element, instead of removing it
 * from the DOM
 */
Vue.directive("visible", function (el, binding) {
  el.style.visibility = binding.value ? "visible" : "hidden";
});

Vue.mixin(locale);
Vue.mixin(localStorage);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
