import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import tippy from "tippy.js";

Vue.config.productionTip = false;

Vue.directive("tippy", {
  bind: function (el, binding) {
    console.log("Bind", binding.value);
  },
  inserted: function (el, binding) {
    console.log("Inserted", binding.value);
    tippy(el, binding.value);
  },
  update: function (el, binding) {
    console.log("Update", binding.value);
    tippy(el, binding.value);
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
