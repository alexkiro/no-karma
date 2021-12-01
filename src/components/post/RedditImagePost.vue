<template>
  <v-carousel
    v-model="model"
    :continuous="false"
    :show-arrows="images.length > 1"
    :hide-delimiters="images.length <= 1"
    hide-delimiter-background
    show-arrows-on-hover
    :height="maxHeight"
    @click.native.stop.prevent=""
  >
    <template #default>
      <v-carousel-item v-for="image in normalizedImages" :key="image.id" eager>
        <div class="image-container" @click="showFullImage(image)">
          <responsive-image
            :source="image.source"
            :resolutions="image.resolutions"
            :alt="post.title"
          />
        </div>
      </v-carousel-item>
    </template>
    <template #next="{ attrs, on }">
      <v-btn v-bind="attrs" rounded icon @click.native.stop.prevent="on.click">
        <v-icon large> mdi-chevron-right </v-icon>
      </v-btn>
    </template>
    <template #prev="{ attrs, on }">
      <v-btn v-bind="attrs" rounded icon @click.native.stop.prevent="on.click">
        <v-icon large> mdi-chevron-left </v-icon>
      </v-btn>
    </template>
  </v-carousel>
</template>

<script>
import ResponsiveImage from "@/components/ResponsiveImage";
import bestFit from "@/lib/mixins/bestFit";

export default {
  name: "RedditImagePost",
  components: { ResponsiveImage },
  mixins: [bestFit],
  props: {
    post: {
      type: Object,
      required: true,
    },
    showFullPost: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: 0,
    };
  },
  computed: {
    images() {
      if (this.post.preview && this.post.preview.images) {
        // TODO: there are also mp4 available here, we could display those instead?
        return this.post.preview.images.map(
          (image) => image.variants.gif || image
        );
      }
      if (this.post.media_metadata) {
        return Object.values(this.post.media_metadata);
      }
      if (
        this.post.is_reddit_media_domain &&
        this.post.url &&
        this.looksLikeImageUrl(this.post.url)
      ) {
        return [
          {
            source: {
              url: this.post.url,
            },
          },
        ];
      }
      return [];
    },
    maxWidth() {
      return Math.max(
        ...this.normalizedImages.map((image) => image.source.bestFit.width)
      );
    },
    maxHeight() {
      return Math.max(
        ...this.normalizedImages.map((image) => image.source.bestFit.height)
      );
    },
    normalizedImages() {
      return this.images.map((img) => {
        const source = this.normalize(img.source || img.s, img.id);
        source.bestFit = this.getBestFit({
          width: source.width,
          height: source.height,
          maxHeight: this.showFullPost ? source.height : undefined,
          fullHeight: true,
        });

        const resolutions = (img.resolutions || img.p || []).map((img) =>
          this.normalize(img, img.id)
        );
        // Separate id just in case resolutions are dupes
        resolutions.push({
          ...source,
          id: source.id + "-source",
        });

        return {
          id: img.id,
          source,
          resolutions: resolutions.reverse(),
        };
      });
    },
  },
  methods: {
    normalize(img, imgId) {
      const norm = {
        width: img.width || img.x,
        height: img.height || img.y,
        url: img.url || img.u,
      };
      norm.id = `${imgId}-${norm.width}-${norm.height}`;
      return norm;
    },
    showFullImage(image) {
      window.open(image.source.url, "_blank", "noreferrer");
    },
  },
};
</script>

<style scoped lang="scss">
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
