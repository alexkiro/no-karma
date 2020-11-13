module.exports = {
  integrity: true,
  lintOnSave: false,
  configureWebpack: {
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
          // vendors: {
          //   name: "chunk-vendors",
          //   test: /[\\/]node_modules[\\/]/,
          //   priority: -10,
          //   chunks: "initial",
          // },
          // common: {
          //   name: "chunk-common",
          //   minChunks: 2,
          //   priority: -20,
          //   chunks: "initial",
          //   reuseExistingChunk: true,
          // },
        },
      },
    },
  },
};
