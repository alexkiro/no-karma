<template>
  <div class="caption d-flex justify-space-between align-center">
    <div>
      <router-link
        v-if="showSubRedditInfo"
        :to="toSubRedditPage"
        class="text-decoration-none text--primary"
      >
        <v-avatar size="18" class="mr-1">
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
          <v-icon v-else>public</v-icon>
        </v-avatar>
        {{ post.subreddit_name_prefixed }}
        &nbsp; &middot;
      </router-link>
      <span v-else class="text--secondary">Posted&nbsp;</span>
      <span class="text--secondary">by u/{{ post.author }}</span>
      &nbsp;
      <span class="text--secondary">
        {{ relativeDateString(createdDate) }}
      </span>
    </div>
    <a
      v-if="showRedditLinks"
      :href="redditLink"
      class="material-icons text-decoration-none"
      target="_blank"
      rel="noopener noreferrer"
    >
      <v-icon dense small>open_in_new</v-icon>
    </a>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RedditPostHeader",
  props: {
    post: {
      type: Object,
      required: true,
    },
    showSubRedditInfo: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    ...mapGetters(["showRedditLinks"]),
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
    subredditIcon() {
      return this.getSubRedditIcon(this.post.sr_detail);
    },
    redditLink() {
      if (!this.post.permalink) return;
      return `https://reddit.com${this.post.permalink}`;
    },
  },
};
</script>

<style scoped></style>
