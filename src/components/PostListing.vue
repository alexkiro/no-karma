<template>
  <div class="post-listing">
    <double-bounce-spinner v-if="loading" />
    <div>
      <reddit-post
        v-for="post in posts"
        :key="post.name"
        :post="post"
        class="rpost"
        :class="{ active: selectedPost && post.name === selectedPost.name }"
        @click.native="selectedPost = post"
      />
    </div>
    <pre v-if="selectedPost" class="selected-post">
      {{ selectedPost }}
    </pre>
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
      loading: true,
      nextParams: {},
      posts: [],
      selectedPost: null,
    };
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
    this.getData();
  },
  methods: {
    ...mapActions(["apiCall"]),
    async getData(limit = 20) {
      this.loading = true;
      try {
        const response = await this.apiCall({
          method: "GET",
          endpoint: this.endpoint,
          params: {
            ...this.nextParams,
            limit,
          },
        });
        this.posts = [
          ...this.posts,
          ...response.data.children.map((child) => child.data),
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

<style scoped lang="less">
.post-listing {
  display: flex;
  flex-grow: 1;
  justify-content: space-evenly;
}

.rpost.active {
  background-color: var(--states-surface-overlay-hover);
  box-shadow: var(--shadow-16dp);
}

.selected-post {
  position: relative;
  background: var(--surface);
  background: var(--elevation-overlay-03dp);
  max-width: 100rem;
  overflow: auto;
  height: min-content;
}
</style>
