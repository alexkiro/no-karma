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
        :width="source.width"
        :height="source.height"
        @load="imageLoaded"
      />
    </picture>
  </div>
</template>

<script>
export default {
  name: "ResponsiveImage",
  props: {
    image: {
      type: Object,
      required: true,
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
  computed: {
    source() {
      return this.normalize(this.image.source || this.image.s, true);
    },
    resolutions() {
      const result = (this.image.resolutions || this.image.p || []).map((img) =>
        this.normalize(img)
      );
      result.push(this.source);
      return result.reverse();
    },
    imageId() {
      return this.image.id;
    },
  },
  mounted() {
    window.setTimeout(() => (this.showLoading = true), 100);
  },
  methods: {
    imageLoaded() {
      this.loaded = true;
    },
    normalize(img, isSource = false) {
      const norm = {
        width: img.width || img.x,
        height: img.height || img.y,
        url: img.url || img.u,
        isSource,
      };
      norm.id = `${this.imageId}-${norm.width}-${norm.height}-${isSource}`;
      return norm;
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;

  height: auto;
  width: fit-content;

  object-fit: contain;
}

.responsive-image {
  position: relative;
  max-height: inherit;
  display: flex;
}
</style>
