<template>
  <div class="reddit-post pa-4">
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
        :href="redditLink"
        class="material-icons text-decoration-none"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-icon dense small>open_in_new</v-icon>
      </a>
    </div>
    <div class="text-h5 post-title">{{ post.title }}</div>

    <div class="post-body-container">
      <reddit-post-body :post="post" :class="{ blurred: isBlurred }" />
      <v-fade-transition>
        <!-- Use an overlay here in case the post has a -->
        <!-- color that makes the text invisible-->
        <v-overlay v-if="isBlurred" absolute>
          <v-btn x-large tile outlined @click="manualShowConfirmed = true">
            Show {{ blurReason }}
          </v-btn>
        </v-overlay>
      </v-fade-transition>
    </div>
  </div>
</template>

<script>
import RedditPostBody from "@/components/RedditPostBody";
import { mapGetters } from "vuex";
export default {
  name: "RedditPost",
  components: { RedditPostBody },
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
  data() {
    return {
      // Some post will require manual confirmation to show,
      // e.g. spoilers and NSFW.
      manualShowConfirmed: false,
    };
  },
  computed: {
    ...mapGetters(["showNSFW"]),
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
    isNSFW() {
      return !this.showNSFW && this.post.over_18;
    },
    isSpoiler() {
      return this.post.spoiler;
    },
    isBlurred() {
      return !this.manualShowConfirmed && (this.isSpoiler || this.isNSFW);
    },
    blurReason() {
      if (this.isSpoiler) return "spoiler";
      if (this.isNSFW) return "nsfw";
      return "";
    },
    subredditIcon() {
      return this.getSubRedditIcon(this.post.sr_detail);
    },
    redditLink() {
      if (!this.post.permalink) return;
      return `https://reddit.com${this.post.permalink}`;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isOverflowing = this.checkIfOverflowing(this.$refs.textPostEl);
    });
  },
  methods: {
    checkIfOverflowing(el) {
      return el && el.scrollHeight > el.clientHeight;
    },
  },
};
</script>

<style scoped lang="scss">
.post-body-container {
  position: relative;
  overflow: hidden;
  min-height: 4rem;
}

.blurred {
  filter: blur(50px);
}
</style>
