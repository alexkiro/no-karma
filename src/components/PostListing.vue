<template>
  <div class="d-flex flex-grow-1 justify-space-around">
    <double-bounce-spinner v-if="initialLoading" />
    <div>
      <v-hover v-for="post in posts" v-slot="{ hover }" :key="post.name">
        <v-sheet
          :elevation="hover ? 16 : 4"
          max-width="55rem"
          class="my-4"
          @click="selectedPost = post"
        >
          <reddit-post :post="post" :show-sub-reddit-info="showSubRedditInfo" />
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
import RedditPost from "@/components/RedditPost";
import DoubleBounceSpinner from "@/components/DoubleBounceSpinner";

export default {
  name: "PostListing",
  components: { DoubleBounceSpinner, RedditPost },
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
      limit: 10,
      loading: false,
      initialLoading: true,
      nextParams: {},
      posts: [],
      selectedPost: null,
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
      this.selectedPost = null;
      this.getData();
    },
  },
  mounted() {
    this.initialLoading = true;
    this.getData().finally(() => (this.initialLoading = false));
  },
  methods: {
    ...mapActions(["apiCall"]),
    async getData() {
      // Check if we are already loading something, and NOOP in that case.
      if (this.loading) return;
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
        this.posts = [
          ...this.posts,
          ...response.data.children.map((child) => {
            return { ...child.data, all_awardings: undefined };
          }),
        ];
        this.nextParams = {
          after: response.data.after,
          count: this.posts.length,
        };
      } finally {
        this.loading = false;
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
