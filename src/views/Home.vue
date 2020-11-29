<template>
  <div class="home">
    <main>
      <keep-alive :max="5">
        <post-listing :key="endpoint" :endpoint="endpoint" />
      </keep-alive>
    </main>
  </div>
</template>

<script>
import PostListing from "@/components/PostListing";

export default {
  name: "Home",
  components: { PostListing },
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
  data() {
    return {};
  },
  computed: {
    endpoint() {
      const parts = [""];
      if (this.subreddit) parts.push("r", this.subreddit);
      parts.push(this.sort);
      return parts.join("/");
    },
  },
};
</script>

<style scoped lang="scss"></style>
