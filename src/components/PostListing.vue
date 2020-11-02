<template>
  <div class="post-listing">
    <double-bounce-spinner v-if="loading" />
    <reddit-post v-for="post in posts" :key="post.name" :post="post" />
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
    };
  },
  watch: {
    endpoint() {
      this.posts = [];
      this.nextParams = {};
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions(["apiCall"]),
    async getData(limit = 50) {
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

<style scoped lang="less"></style>
