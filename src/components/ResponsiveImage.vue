<template>
  <div class="responsive-image">
    <v-overlay v-if="showLoading && !loaded" absolute>
      <v-progress-circular indeterminate color="grey lighten-5" />
    </v-overlay>
    <picture>
      <source
        v-for="r in resolutions"
        :key="r.id"
        :srcset="`${r.url} ${r.width}w`"
        :media="`(min-width: ${r.width * factor}px)`"
      />
      <img
        loading="lazy"
        :src="source.url"
        referrerpolicy="no-referrer"
        :alt="alt"
        :width="(source.bestFit && source.bestFit.width) || source.width"
        :height="(source.bestFit && source.bestFit.height) || source.height"
        @load="imageLoaded"
      />
    </picture>
  </div>
</template>

<script>
export default {
  name: "ResponsiveImage",
  props: {
    source: {
      type: Object,
      required: true,
    },
    resolutions: {
      type: Array,
      default: () => [],
      required: false,
    },
    alt: {
      type: String,
      required: false,
      default: "",
    },
    factor: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  data() {
    return {
      showLoading: false,
      loaded: false,
    };
  },
  mounted() {
    window.setTimeout(() => (this.showLoading = true), 100);
  },
  methods: {
    imageLoaded() {
      this.loaded = true;
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
}

.responsive-image {
  position: relative;
  max-height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
