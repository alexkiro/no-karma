<template>
  <div class="reddit-post mb-4 pa-4">
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
    <div class="d-flex align-start justify-center body-2 mt-3">
      <div v-if="postText" class="" v-html="postText" />
      <div v-else-if="video" key="image-post">
        <v-lazy
          :max-height="video.height + 'px'"
          :max-width="video.width + 'px'"
        >
          <responsive-video :video="video" />
        </v-lazy>
      </div>
      <div v-else-if="showImage" key="image-post">
        <responsive-image
          v-if="showImage"
          :key="currentImage.id"
          :image="currentImage"
          :alt="post.title"
        />
      </div>
      <!--      <div v-if="embedded" v-html="embedded.content || embedded.html"></div>-->
    </div>
    <a
      v-if="postUrl"
      :href="postUrl"
      class="caption d-flex align-center text-decoration-none"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="url">{{ displayUrl }}</span>
      <v-icon small color="info">open_in_new</v-icon>
    </a>
  </div>
</template>

<script>
import ResponsiveImage from "@/components/ResponsiveImage";
import ResponsiveVideo from "@/components/ResponsiveVideo";
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
    embedded() {
      const embed =
        this.post.secure_media_embed ||
        (this.post.secure_media && this.post.secure_media.oembed) ||
        this.post.media_embed ||
        (this.post.media && this.post.media.oembed);
      return embed.html || embed.content;
    },
    video() {
      return (
        (this.post.secure_media && this.post.secure_media.reddit_video) ||
        (this.post.media && this.post.media.reddit_video)
      );
    },
    postUrl() {
      if (
        this.post.post_hint !== "link" ||
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

<style scoped lang="scss">
.reddit-post {
  & > * + * {
    margin-top: 4px;
  }
}
</style>
