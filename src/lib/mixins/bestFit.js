export default {
  methods: {
    getBestFit({
      width,
      height,
      maxWidth = 55 * 16,
      maxHeight = 36 * 16,
      padding = 32,
      fullWidth = false,
      fullHeight = false,
    }) {
      const maxWindowWidth = fullWidth
        ? Infinity
        : this.$vuetify.breakpoint.width;
      const maxWindowHeight = fullHeight
        ? Infinity
        : this.$vuetify.breakpoint.height;

      maxWidth = Math.min(maxWindowWidth, maxWidth) - padding;
      maxHeight = Math.min(maxWindowHeight, maxHeight) - padding;

      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const bestRatio = Math.min(widthRatio, heightRatio);

      return {
        width: width * bestRatio,
        height: height * bestRatio,
      };
    },
  },
};
