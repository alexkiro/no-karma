<template>
  <div class="d-flex flex-grow-1 justify-space-around">
    <double-bounce-spinner v-if="loading" />
    <div>
      <v-hover v-for="post in posts" v-slot="{ hover }" :key="post.name">
        <v-sheet
          :elevation="hover ? 16 : 4"
          max-width="55rem"
          class="ma-4"
          @click="selectedPost = post"
        >
          <reddit-post :post="post" />
        </v-sheet>
      </v-hover>
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
