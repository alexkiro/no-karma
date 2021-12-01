<template>
  <video
    controls
    :muted="mutedVideos"
    class="hosted-video"
    :style="{
      width: video.width + 'px',
      height: video.height + 'px',
    }"
  ></video>
</template>

<script>
import appSettings from "../lib/mixins/appSettings";

export default {
  name: "ResponsiveVideo",
  mixins: [appSettings],
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
    this.initPlayer();
  },
  methods: {
    async initPlayer() {
      const dashjs = await import("dashjs");
      this.player = dashjs.MediaPlayer().create();
      this.player.initialize(this.$el, this.dashUrl);
    },
  },
};
</script>

<style scoped lang="scss">
.hosted-video {
  object-fit: contain;
  outline: none;
  max-height: 36rem;
  max-width: 100%;
  background-color: black;
}
</style>
