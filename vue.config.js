const path = require("path");

process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  lintOnSave: false,

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/styles/mixins/*.less")],
    },
  },
};
