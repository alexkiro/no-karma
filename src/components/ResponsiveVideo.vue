<template>
  <video controls muted class="hosted-video"></video>
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
.hosted-video {
  object-fit: contain;
  outline: none;
  max-height: 36rem;
  height: 100%;
  width: 100%;
  background-color: black;
}
</style>
