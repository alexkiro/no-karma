export default {
  methods: {
    getSubRedditIcon(sub) {
      return sub && (sub.community_icon || sub.icon_img);
    },
  },
};
