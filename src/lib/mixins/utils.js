const imageExtensions = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg"]);

export default {
  methods: {
    getSubRedditIcon(sub) {
      return (
        (sub && (sub.community_icon || sub.icon_img)) ||
        `${this.$store.getters.avatarBase}/api/initials/${sub.display_name}.svg`
      );
    },
    looksLikeImageUrl(url) {
      try {
        const ext = new URL(url).pathname.toLowerCase().split(".").pop();
        return imageExtensions.has(ext);
      } catch (e) {
        return false;
      }
    },
  },
};
