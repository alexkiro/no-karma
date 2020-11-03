<template>
  <video
    controls
    preload="auto"
    :height="video.height"
    :width="video.width"
    muted
  ></video>
</template>

<script>
import dashjs from "dashjs";

export default {
  name: "ResponsiveVideo",
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      player: null,
    };
  },
  computed: {
    dashUrl() {
      const url = new URL(this.video.dash_url);
      url.hostname = this.$store.getters.videoBase;
      url.protocol = window.location.protocol;
      return url.toString();
    },
  },
  mounted() {
    this.player = dashjs.MediaPlayer().create();
    this.player.initialize(this.$el, this.dashUrl);
  },
};
</script>

<style scoped lang="less">
video {
  outline: none;
}
</style>
