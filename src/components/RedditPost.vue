<template>
  <div class="reddit-post">
    <div class="post-metadata small">
      <span>{{ post.subreddit_name_prefixed }}</span>
      &nbsp;
      <span class="muted">&middot; by u/{{ post.author }}</span>
      &nbsp;
      <span v-tippy="{ content: longDate }" class="muted">
        {{ relativeDateString(createdDate) }}
      </span>
    </div>
    <h6 class="post-title">{{ post.title }}</h6>
    <div class="post-body">
      <transition>
        <img
          v-if="currentImage"
          :key="currentImage.id"
          :src="currentImage.url"
          loading="lazy"
          referrerpolicy="no-referrer"
          :alt="post.title"
        />
      </transition>
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
      v-if="post.url_overridden_by_dest"
      :href="post.url_overridden_by_dest"
      class="post-url small"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="url">{{ post.url_overridden_by_dest }}</span>
      <span class="material-icons">launch</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "RedditPost",
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
    images() {
      let imageList = [];
      if (this.post.preview && this.post.preview.images) {
        imageList = this.post.preview.images;
      }
      if (this.post.media_metadata) {
        imageList = Object.values(this.post.media_metadata);
      }

      return imageList.map((image) => {
        const source = image.source || image.s;
        const resolutions = image.resolutions || image.p;
        const preview = [...resolutions]
          .reverse()
          .find((res) => (res.width || res.x) < 1000);

        return {
          id: image.id,
          source: source.url || source.u,
          url: preview && (preview.url || preview.u),
        };
      });
    },
    currentImage() {
      return this.images[this.imageIndex];
    },
  },
};
</script>

<style scoped lang="less">
.reddit-post {
  position: relative;
  background: var(--surface);
  background: var(--elevation-overlay-03dp);
  max-width: 100rem;
  overflow: hidden;

  padding: 2rem;
  border-radius: var(--rounded);
  box-shadow: var(--shadow-02dp);
  transition: all 0.3s var(--ease-function);

  display: flex;
  flex-direction: column;

  & > * + * {
    margin-top: 1rem;
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

  .post-body {
    position: relative;
    margin-top: 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    //max-height: 70rem;
    overflow: hidden;

    .gallery-controls {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;

      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      button {
        color: black;
        background-color: white;
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
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
