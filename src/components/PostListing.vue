<template>
  <div class="d-flex flex-grow-1 justify-space-around">
    <double-bounce-spinner v-if="initialLoading" />
    <div>
      <v-hover v-for="post in posts" v-slot="{ hover }" :key="post.id">
        <v-sheet :elevation="hover ? 16 : 4" max-width="55rem" class="my-4">
          <router-link
            :to="{
              name: 'post-view',
              params: {
                subreddit: post.subreddit,
                postId: post.id,
              },
            }"
            class="unstyled"
            :target="openPostInNewTab ? '_blank' : '_self'"
          >
            <reddit-post
              :post="post"
              :show-sub-reddit-info="showSubRedditInfo"
              @click.native="addToCache(post)"
            />
          </router-link>
        </v-sheet>
      </v-hover>
      <div
        v-if="hasMore"
        v-intersect="getData"
        class="load-more-trigger d-flex align-center justify-center"
      >
        <double-bounce-spinner class="my-12" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import RedditPost from "@/components/post/RedditPost";
import DoubleBounceSpinner from "@/components/DoubleBounceSpinner";
import appSettings from "@/lib/mixins/appSettings";

export default {
  name: "PostListing",
  components: { DoubleBounceSpinner, RedditPost },
  mixins: [appSettings],
  props: {
    endpoint: {
      type: String,
      default: "/best",
      required: false,
    },
    showSubRedditInfo: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      limit: 20,
      loading: false,
      initialLoading: true,
      nextParams: {},
      posts: [],
      uniqueIds: new Set(),
    };
  },
  computed: {
    hasMore() {
      return !!this.nextParams.after;
    },
  },
  watch: {
    endpoint() {
      this.posts = [];
      this.nextParams = {};
      this.getData();
    },
  },
  mounted() {
    this.initialLoading = true;
    this.getData().finally(() => (this.initialLoading = false));
  },
  methods: {
    ...mapActions(["apiCall"]),
    addToCache(post) {
      this.$store.commit("cachePost", { ...post });
    },
    async getData() {
      // Check if we are already loading something, and NOOP in that case.
      if (this.loading) return;
      let newPosts = [];
      const params = {
        ...this.nextParams,
        limit: this.limit,
      };
      if (this.showSubRedditInfo) {
        params.sr_detail = "true";
      }

      try {
        this.loading = true;
        const response = await this.apiCall({
          method: "GET",
          endpoint: this.endpoint,
          params,
        });
        newPosts = response.data.children
          .filter((child) => !this.uniqueIds.has(child.data.id))
          .map((child) => child.data);
        this.posts.push(...newPosts);
        newPosts.forEach((child) => this.uniqueIds.add(child.id));
        this.nextParams = {
          after: response.data.after,
          count: this.posts.length,
        };
      } finally {
        this.loading = false;
      }

      // All duplicates maybe?
      if (newPosts.length === 0 && this.nextParams.after) {
        await this.getData();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.selected-post {
  position: relative;
  max-width: 55rem;
  overflow: auto;
  height: min-content;
}
</style>
