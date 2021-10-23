<template>
  <main>
    <subreddit-header v-if="!isMultiSubReddit" :subreddit="subreddit" />
    <post-listing
      :key="endpoint"
      :endpoint="endpoint"
      :show-sub-reddit-info="isMultiSubReddit"
    />
  </main>
</template>

<script>
import PostListing from "@/components/PostListing";
import SubredditHeader from "@/components/SubredditHeader";

const multiSubReddits = new Set(["", "all", "popular"]);

export default {
  name: "PostListView",
  components: { SubredditHeader, PostListing },
  props: {
    subreddit: {
      type: String,
      required: false,
      default: "",
    },
    sort: {
      type: String,
      required: false,
      default: "best",
    },
  },
  computed: {
    endpoint() {
      const parts = [""];
      if (this.subreddit) parts.push("r", this.subreddit);
      parts.push(this.sort);
      return parts.join("/");
    },
    isMultiSubReddit() {
      return multiSubReddits.has(this.subreddit);
    },
  },
};
</script>

<style scoped lang="scss"></style>
