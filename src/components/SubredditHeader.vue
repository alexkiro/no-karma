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
        referrerpolicy="no-referrer"
        alt=""
      />
    </header>
    <v-sheet
      v-if="subDetails"
      elevation="8"
      class="d-flex align-center justify-center pa-2"
    >
      <div
        class="
          sub-title
          unstyled
          d-flex
          align-center
          flex-grow-1
          justify-space-between
        "
      >
        <router-link
          :to="{
            name: 'home-sub',
            params: {
              subreddit,
            },
          }"
          class="d-flex align-center unstyled"
        >
          <v-avatar size="80" class="sub-icon mr-4 grey--text elevation-4">
            <img
              v-if="subredditIcon"
              :src="subredditIcon"
              loading="lazy"
              referrerpolicy="no-referrer"
              alt=""
              width="256px"
              height="256px"
            />
            <v-icon v-else class="grey--text" size="48">public</v-icon>
          </v-avatar>
          <h3>
            {{ subDetails.title }}
          </h3>
        </router-link>
        <div class="d-flex align-center">
          <v-btn
            :color="isSubscribed ? '' : 'red'"
            :loading="loading"
            @click="toggleSubStatus"
          >
            {{ isSubscribed ? "Subscribed" : "Subscribe" }}
          </v-btn>
          <a
            v-if="showRedditLinks"
            :href="redditLink"
            class="material-icons text-decoration-none ml-2"
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
import { mapActions, mapGetters } from "vuex";

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
      isSubscribed: false,
      subDetails: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["showRedditLinks"]),
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
    ...mapActions(["getSubRedditDetails", "apiCall"]),
    async loadSubDetails() {
      this.loading = true;
      try {
        this.subDetails = await this.getSubRedditDetails(this.subreddit);
        this.isSubscribed = this.subDetails.user_is_subscriber;
      } finally {
        this.loading = false;
      }
    },
    async toggleSubStatus() {
      try {
        this.loading = true;
        await this.apiCall({
          method: "POST",
          endpoint: "/api/subscribe ",
          data: {
            action: this.isSubscribed ? "unsub" : "sub",
            sr: this.subDetails.name,
          },
        });
        this.isSubscribed = !this.isSubscribed;
      } finally {
        this.loading = false;
      }
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
