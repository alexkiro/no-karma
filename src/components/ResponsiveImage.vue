<template>
  <div>
    <loading v-if="showLoading && !loaded" />
    <picture>
      <source
        v-for="r in resolutions"
        :key="r.width"
        :srcset="`${r.url} ${r.width}w`"
        :media="`(min-width: ${r.width * factor}px)`"
      />
      <img
        loading="lazy"
        :src="source.url"
        rel="noopener noreferrer"
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
import Loading from "@/components/Loading";
export default {
  name: "ResponsiveImage",
  components: { Loading },
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
      return this.normalize(this.image.source || this.image.s);
    },
    resolutions() {
      return (this.image.resolutions || this.image.p)
        .map((img) => this.normalize(img))
        .reverse();
    },
  },
  mounted() {
    window.setTimeout(() => (this.showLoading = true), 100);
  },
  methods: {
    imageLoaded() {
      this.loaded = true;
    },
    normalize(img) {
      return {
        width: img.width || img.x,
        height: img.height || img.y,
        url: img.url || img.u,
      };
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
