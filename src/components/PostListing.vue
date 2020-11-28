<template>
  <div class="d-flex flex-grow-1 justify-space-around">
    <double-bounce-spinner v-if="loading" />
    <div>
      <v-hover v-for="post in posts" v-slot="{ hover }" :key="post.name">
        <v-sheet
          :elevation="hover ? 16 : 4"
          max-width="55rem"
          class="my-4"
          @click="selectedPost = post"
        >
          <reddit-post :post="post" />
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
    <v-card v-if="selectedPost" elevation="24" class="selected-post">
      <pre>
      {{ selectedPost }}
      </pre>
    </v-card>
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
  },
  data() {
    return {
      limit: 10,
      loading: true,
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
    this.loading = true;
    this.getData().finally(() => (this.loading = false));
  },
  methods: {
    ...mapActions(["apiCall"]),
    async getData() {
      const response = await this.apiCall({
        method: "GET",
        endpoint: this.endpoint,
        params: {
          ...this.nextParams,
          limit: this.limit,
        },
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
