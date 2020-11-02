module.exports = {
  // See https://babeljs.io/docs/en/babel-preset-env.html
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "usage", // set to false to disable polyfills
      },
    ],
  ],
};
