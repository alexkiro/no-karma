<template>
  <div class="reddit-post">
    <div class="post-metadata small">
      <div>
        <span>{{ post.subreddit_name_prefixed }}</span>
        &nbsp;
        <span class="muted">&middot; by u/{{ post.author }}</span>
        &nbsp;
        <span v-tippy="{ content: longDate }" class="muted">
          {{ relativeDateString(createdDate) }}
        </span>
        <b>{{ post.post_hint }}</b>
      </div>
      <a
        :href="redditLink"
        class="material-icons"
        target="_blank"
        rel="noopener noreferrer"
      >
        open_in_new
      </a>
    </div>
    <h5 class="post-title">{{ post.title }}</h5>
    <div class="post-body-container">
      <div v-if="postText" class="post-body text" v-html="postText" />
      <div v-else-if="video" key="image-post" class="post-body image">
        <responsive-video :video="video" />
      </div>
      <div v-else-if="showImage" key="image-post" class="post-body image">
        <transition>
          <responsive-image
            v-if="showImage"
            :key="currentImage.id"
            :image="currentImage"
            :alt="post.title"
          />
        </transition>
        <!--      <div v-if="embedded" v-html="embedded.content || embedded.html"></div>-->
      </div>

      <div v-if="images.length > 1" class="gallery-controls">
        <button
          v-visible="imageIndex > 0"
          class="icon-button material-icons"
          @click="imageIndex = imageIndex - 1"
        >
          chevron_left
        </button>
        <button
          v-visible="images.length - imageIndex > 1"
          class="icon-button material-icons"
          @click="imageIndex = imageIndex + 1"
        >
          chevron_right
        </button>
      </div>
    </div>
    <a
      v-if="postUrl"
      :href="postUrl"
      class="post-url small"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="url">{{ displayUrl }}</span>
      <span class="material-icons">open_in_new</span>
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

<style lang="less">
.md {
  //color: var(--on-surface-medium-emphasis);

  p + p {
    margin-top: 1.5rem;
  }
}
</style>

<style scoped lang="less">
.reddit-post {
  position: relative;
  background: var(--surface);
  background: var(--elevation-overlay-03dp);
  max-width: 100rem;

  padding: 2rem;
  border-radius: var(--rounded);
  box-shadow: var(--shadow-02dp);
  transition: all 0.3s var(--ease-function);

  display: flex;
  align-items: flex-start;
  flex-direction: column;

  & > * + * {
    margin-top: 1rem;
  }

  .post-metadata {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    .material-icons {
      font-size: 2rem;
    }
  }

  .post-url {
    display: flex;
    align-items: center;
    margin-top: 2rem;

    .material-icons {
      margin-left: 0.5rem;
      font-size: 2rem;
    }

    .url:hover {
      text-decoration: underline;
    }
  }

  .post-body-container {
    width: 100%;
  }

  .post-body {
    position: relative;
    margin-top: 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    //max-height: 70rem;
    overflow: hidden;
  }

  .gallery-controls {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;

    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    button {
      color: black;
      background-color: white;
      box-shadow: var(--shadow-12dp);
      font-size: 4rem;
      min-width: 6rem;
      min-height: 6rem;
      max-width: 6rem;
      max-height: 6rem;
    }
  }

  &:hover {
    background-color: var(--states-surface-overlay-hover);
    box-shadow: var(--shadow-12dp);
  }

  & + .reddit-post {
    margin-top: 2rem;
  }
}
</style>
