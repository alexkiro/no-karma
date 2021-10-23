<template>
  <div>
    <header
      v-if="subDetails"
      class="sub-banner"
      :style="{
        'background-color': bannerColor,
      }"
    >
      <img
        class="banner-image"
        :src="subDetails.banner_background_image"
        loading="lazy"
        rel="noopener noreferrer"
        referrerpolicy="no-referrer"
        alt=""
      />
    </header>
    <v-sheet
      v-if="subDetails"
      elevation="8"
      class="d-flex align-center justify-center pa-2"
    >
      <div class="d-flex align-center flex-grow-1 sub-title">
        <v-avatar size="80" class="sub-icon mr-4 grey--text elevation-4">
          <img
            v-if="subredditIcon"
            :src="subredditIcon"
            loading="lazy"
            rel="noopener noreferrer"
            referrerpolicy="no-referrer"
            alt=""
            width="256px"
            height="256px"
          />
          <v-icon v-else class="grey--text" size="48">public</v-icon>
        </v-avatar>
        <div class="d-flex justify-space-between align-center flex-grow-1">
          <h3>
            {{ subDetails.title }}
          </h3>
          <a
            :href="redditLink"
            class="material-icons text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-icon dense small>open_in_new</v-icon>
          </a>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SubredditHeader",
  props: {
    subreddit: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      subDetails: null,
    };
  },
  computed: {
    bannerColor() {
      return (
        this.subDetails.banner_background_color ||
        this.subDetails.key_color ||
        "var(--v-secondary-base)"
      );
    },
    subredditIcon() {
      return this.getSubRedditIcon(this.subDetails);
    },
    redditLink() {
      return `https://reddit.com/r/${this.subreddit}`;
    },
  },
  watch: {
    subreddit() {
      this.loadSubDetails();
    },
  },
  mounted() {
    this.loadSubDetails();
  },
  methods: {
    ...mapActions(["getSubRedditDetails"]),
    async loadSubDetails() {
      this.subDetails = await this.getSubRedditDetails(this.subreddit);
    },
  },
};
</script>

<style scoped lang="scss">
.sub-banner {
  overflow: hidden;
  min-height: 5rem;
  max-height: 10rem;

  .banner-image {
    width: 100%;
  }
}

.sub-title {
  max-width: 55rem;

  .sub-icon {
    border: 4px solid white;
    margin-top: -1.5rem;
    background-color: white;
  }
}
</style>
