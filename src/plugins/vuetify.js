import "@mdi/font/css/materialdesignicons.css";

import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const plugin = new Vuetify({
  theme: { disable: true },
  icons: {
    iconfont: "mdi",
  },
});
// Monkey patch the function that generates the element.
plugin.framework.theme.genStyleElement = () => {};
export default plugin;
