<template>
  <div class="reddit-post pa-4">
    <div class="caption d-flex justify-space-between align-center">
      <div>
        <router-link
          :to="toSubRedditPage"
          class="text-decoration-none text--primary"
        >
          {{ post.subreddit_name_prefixed }}
        </router-link>
        &nbsp;
        <span class="text--secondary">&middot; by u/{{ post.author }}</span>
        &nbsp;
        <span class="text--secondary">
          {{ relativeDateString(createdDate) }}
        </span>
        <b class="text--secondary">{{ post.post_hint }}</b>
      </div>
      <a
        :href="redditLink"
        class="material-icons text-decoration-none"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-icon dense small>open_in_new</v-icon>
      </a>
    </div>
    <div class="text-h5">{{ post.title }}</div>
    <div class="d-flex align-start justify-center body-2 mt-3 post-body">
      <div
        v-if="postText"
        key="text-post"
        class="flex-grow-1"
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
  </div>
</template>

<script>
import ResponsiveImage from "@/components/ResponsiveImage";
import ResponsiveVideo from "@/components/ResponsiveVideo";
import { mapGetters } from "vuex";

// Google and others are doo-doo, and do not work while sandboxed.
const sandboxExceptions = new Set(["youtube.com", "streamable.com"]);

export default {
  name: "RedditPost",
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
    };
  },
  computed: {
    ...mapGetters(["csp"]),
    toSubRedditPage() {
      return {
        name: "home-sub",
        params: { ...this.$route.params, subreddit: this.post.subreddit },
      };
    },
    createdDate() {
      return new Date(this.post.created_utc * 1000);
    },
    longDate() {
      return this.locales.longDateTime.format(this.createdDate);
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
    images() {
      if (this.post.preview && this.post.preview.images) {
        return this.post.preview.images;
      }
      if (this.post.media_metadata) {
        return Object.values(this.post.media_metadata);
      }
      return [];
    },
    currentImage() {
      return this.images[this.imageIndex];
    },
    redditLink() {
      if (!this.post.permalink) return;
      return `https://reddit.com${this.post.permalink}`;
    },
    secureEmbed() {
      if (
        !this.post.secure_media_embed ||
        !this.post.secure_media_embed.media_domain_url
      )
        return;
      let sandbox = "allow-scripts";
      if (this.post.secure_media) {
        if (sandboxExceptions.has(this.post.secure_media.type)) {
          sandbox = undefined;
        }
      }

      const url = new URL(this.post.secure_media_embed.media_domain_url);
      // Mistery params from reddit
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
    // XXX Unsafe embedding
    // embedded() {
    //   const parser = new DOMParser();
    //   const embed =
    //     this.post.secure_media_embed ||
    //     (this.post.secure_media && this.post.secure_media.oembed) ||
    //     this.post.media_embed ||
    //     (this.post.media && this.post.media.oembed);
    //   const html = parser.parseFromString(
    //     embed.html || embed.content,
    //     "text/html"
    //   );
    //   const iframe = html.body.querySelector("iframe");
    //   if (!iframe) return "";
    //   iframe.allow = "";
    //   iframe.loading = "lazy";
    //   iframe.referrerpolicy = "no-referrer";
    //   iframe.style = null;
    //   // iframe.sandbox = "allow-scripts allow-same-origin";
    //   return iframe.outerHTML;
    // },
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
      const url = new URL(this.postUrl);
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
}
</style>

<style scoped lang="scss">
.image-post {
  max-height: 36rem;
}

.video-post,
.embedded-media {
  width: 100%;
  max-height: 36rem;

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    height: 36rem;
  }
}

.embedded-media {
  object-fit: contain;
  outline: none;
  border: none;
  overflow: hidden;
  margin: 0 auto;
}

.post-body {
  word-break: break-word;
  & > * {
    max-width: 100%;
  }
}
</style>
