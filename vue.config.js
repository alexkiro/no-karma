const { GenerateSW } = require("workbox-webpack-plugin");

const plugins = [];

if (process.env.NODE_ENV === "production" && !process.env.VUE_APP_NO_PWA) {
  plugins.push(
    new GenerateSW({
      // Always force update to new version
      skipWaiting: true,
      navigateFallback: "index.html",
    })
  );
}

module.exports = {
  integrity: true,
  lintOnSave: false,
  configureWebpack: {
    plugins,
    optimization: {
      splitChunks: {
        cacheGroups: {
          vuetify: {
            name: "vuetify",
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            priority: 0,
            chunks: "initial",
          },
          dashjs: {
            name: "dashjs",
            test: /[\\/]node_modules[\\/]dashjs[\\/]/,
            priority: 0,
            chunks: "initial",
          },
          mdi: {
            name: "material-design-icons-iconfont",
            test: /[\\/]node_modules[\\/]material-design-icons-iconfont[\\/]/,
            priority: 0,
            chunks: "initial",
          },
        },
      },
    },
  },
};
