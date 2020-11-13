import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const plugin = new Vuetify({
  theme: { disable: true },
  icons: {
    iconfont: "md",
  },
});
// Monkey patch the function that generates the element.
plugin.framework.theme.genStyleElement = () => {};
export default plugin;
