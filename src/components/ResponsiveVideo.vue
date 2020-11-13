<template>
  <video controls muted :height="video.height" :width="video.width"></video>
</template>

<script>
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
    this.initPlayer();
  },
  methods: {
    async initPlayer() {
      const dashjs = await import("dashjs");
      // TODO Only init if set to play, otherwise show the placeholder
      this.player = dashjs.MediaPlayer().create();
      this.player.initialize(this.$el, this.dashUrl);
    },
  },
};
</script>

<style scoped lang="scss">
video {
  outline: none;
  max-width: 100%;
  height: auto;
}
</style>
