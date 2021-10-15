<template>
  <div class="d-flex align-start justify-center body-2 mt-3 post-body">
    <div
      v-if="postText"
      key="text-post"
      ref="textPostEl"
      class="flex-grow-1 text-post"
      :class="{
        overflowing: isOverflowing,
      }"
      v-html="postText"
    />
    <iframe
      v-else-if="secureEmbed"
      key="embedded-post"
      class="embedded-media"
      :src="secureEmbed.url"
      :width="secureEmbed.width"
      :height="secureEmbed.height"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer"
      :sandbox="secureEmbed.sandbox"
      scrolling="no"
    />
    <v-lazy v-else-if="video" key="image-post" class="video-post">
      <responsive-video :video="video" />
    </v-lazy>
    <div v-else-if="showImage" key="image-post" class="image-post">
      <responsive-image
        v-if="showImage"
        :key="currentImage.id"
        :image="currentImage"
        :alt="post.title"
      />
      <div v-if="images.length > 1" class="image-controls">
        <v-btn
          v-visible="imageIndex > 0"
          elevation="8"
          fab
          small
          @click="imageIndex -= 1"
        >
          <v-icon> navigate_before </v-icon>
        </v-btn>
        <v-btn
          v-visible="imageIndex < images.length - 1"
          elevation="8"
          fab
          small
          @click="imageIndex += 1"
        >
          <v-icon> navigate_next </v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else-if="postUrl" key="link-post" class="flex-grow-1">
      <a
        :href="postUrl"
        class="caption d-flex align-center text-decoration-none"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="url">{{ displayUrl }}</span>
        <v-icon small color="info">open_in_new</v-icon>
      </a>
    </div>
  </div>
</template>

<script>
import ResponsiveImage from "@/components/ResponsiveImage";
import ResponsiveVideo from "@/components/ResponsiveVideo";

// XXX TBH, not sure if this is sustainable.
// Google and others are doo-doo, and do not work while sandboxed.
const sandboxExceptions = new Set([
  "youtube.com",
  "streamable.com",
  "YouTube",
  "BandCamp", // Looks kinda wonky :/
  "Gfycat",
  "imgur.com",
]);

export default {
  name: "RedditPostBody",
  components: { ResponsiveVideo, ResponsiveImage },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageIndex: 0,
      isOverflowing: false,
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
      return [];
    },
    currentImage() {
      return this.images[this.imageIndex];
    },
    showImage() {
      return (
        // Text post maybe, no need to show an image for these?
        this.post.post_hint !== "self" &&
        // Only show thumbnail for links
        this.post.post_hint !== "link" &&
        // We actually need an image to display
        this.currentImage
      );
    },
    secureEmbed() {
      if (
        !this.post.secure_media_embed ||
        !this.post.secure_media_embed.media_domain_url
      )
        return;
      let sandbox = "allow-scripts";
      if (this.post.secure_media) {
        if (
          sandboxExceptions.has(this.post.secure_media.type) ||
          sandboxExceptions.has(this.post.secure_media.oembed.provider_name)
        ) {
          sandbox = undefined;
        }
      }

      const url = new URL(this.post.secure_media_embed.media_domain_url);
      // Mystery params from reddit
      url.searchParams.append("responsive", "true");
      url.searchParams.append(
        "is_nightmode",
        this.$vuetify.theme.dark.toString()
      );

      return {
        sandbox,
        url: url.toString(),
        width: this.post.secure_media_embed.width,
        height: this.post.secure_media_embed.height,
      };
    },
    video() {
      return (
        (this.post.secure_media && this.post.secure_media.reddit_video) ||
        (this.post.preview && this.post.preview.reddit_video_preview) ||
        (this.post.media && this.post.media.reddit_video)
      );
    },
    postUrl() {
      if (
        (this.post.post_hint && this.post.post_hint !== "link") ||
        this.post.is_self ||
        this.post.is_reddit_media_domain ||
        this.post.domain === "reddit.com"
      )
        return;
      return this.post.url || this.post.url_overridden_by_dest;
    },
    displayUrl() {
      if (!this.postUrl) return;
      let url;
      try {
        url = new URL(this.postUrl);
      } catch (e) {
        return this.postUrl;
      }
      const domain =
        (!this.post.is_self && this.post.domain) || url.host || url.hostname;

      let path = url.pathname.slice(0, 20);
      if (path.length < url.pathname.length) {
        path += "...";
      }
      return domain + path;
    },
    postText() {
      return this.post.selftext_html || this.post.selftext;
    },
  },
};
</script>

<style lang="scss">
.post-body .md {
  h1,
  h2,
  h3,
  h5,
  h5,
  h6 {
    margin: 2rem 0;
    line-height: 1;
  }

  hr {
    margin: 1rem 0;
  }

  max-width: 100%;

  pre {
    max-width: 95vw;
    overflow: auto;
  }
}
</style>

<style scoped lang="scss">
.image-post {
  max-height: 36rem;

  .image-controls {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.video-post,
.embedded-media {
  width: 100%;
  max-height: 36rem;

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    max-height: 36rem;
  }
}

.text-post {
  max-height: 36rem;
  overflow: hidden;

  &.overflowing {
    mask-image: linear-gradient(180deg, #000 80%, transparent);
  }
}

.text-post .embedded-media {
  object-fit: contain;
  outline: none;
  border: none;
  overflow: hidden;
  margin: 0 auto;
}

.post-title {
  word-break: break-word;
}

.post-body {
  position: relative;
  word-break: break-word;

  & > * {
    max-width: 100%;
  }
}
</style>
