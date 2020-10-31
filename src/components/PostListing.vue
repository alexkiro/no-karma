<template>
  <div class="post-listing">
    <reddit-post v-for="post in posts" :key="post.name" :post="post" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import RedditPost from "@/components/RedditPost";

export default {
  name: "PostListing",
  components: { RedditPost },
  props: {
    endpoint: {
      type: String,
      default: "/hot",
      required: false,
    },
  },
  data() {
    return {
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
    },
  },
};
</script>

<style scoped lang="less"></style>
