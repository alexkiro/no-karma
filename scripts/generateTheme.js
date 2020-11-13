const fs = require("fs");
const Vuetify = require("vuetify");
const theme = {
  // See https://vuetifyjs.com/en/features/theme/
  options: {
    customProperties: true,
  },
  // themes: {
  //   light: {
  //     primary: "#ee44aa",
  //     secondary: "#424242",
  //     accent: "#82B1FF",
  //     error: "#FF5252",
  //     info: "#2196F3",
  //     success: "#4CAF50",
  //     warning: "#FFC107",
  //   },
  // },
};

function getTheme(dark, selector) {
  const styles = new Vuetify({
    theme: {
      ...theme,
      dark,
    },
  }).framework.theme.generatedStyles;
  return styles.replace(/^:root/, selector);
}

fs.writeFileSync(
  "src/styles/theme.scss",
  [
    getTheme(false, ".v-application.theme--light"),
    getTheme(true, ".v-application.theme--dark"),
  ].join("\n\n")
);
