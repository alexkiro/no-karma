const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  integrity: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new GenerateSW({
        navigateFallback: "index.html",
      }),
    ],
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
