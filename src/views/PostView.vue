<template>
  <div>
    <subreddit-header :subreddit="subreddit" />
    <main class="d-flex flex-grow-1 justify-space-around">
      <double-bounce-spinner v-if="initialLoading" />
      <v-sheet max-width="55rem" class="my-4">
        <reddit-post
          v-if="post"
          :post="post"
          :show-sub-reddit-info="false"
          :show-full-post="true"
        />
      </v-sheet>
    </main>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SubredditHeader from "@/components/SubredditHeader";
import RedditPost from "@/components/post/RedditPost";
import DoubleBounceSpinner from "@/components/DoubleBounceSpinner";

export default {
  name: "PostView",
  components: { DoubleBounceSpinner, RedditPost, SubredditHeader },
  props: {
    subreddit: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    sort: {
      type: String,
      required: false,
      default: "best",
    },
  },
  data() {
    return {
      initialLoading: true,
      comments: [],
    };
  },
  computed: {
    commentsEndpoint() {
      return `/r/${this.subreddit}/comments/${this.postId}`;
    },
    post() {
      if (!this.comments[0]) return;
      return this.comments[0].data.children[0].data;
    },
  },
  mounted() {
    this.loadComments();
  },
  methods: {
    ...mapActions(["apiCall"]),
    async loadComments() {
      this.initialLoading = true;
      try {
        this.comments = await this.apiCall({
          endpoint: this.commentsEndpoint,
          params: {
            sort: this.sort,
            sr_detail: false,
          },
        });
      } finally {
        this.initialLoading = false;
      }
    },
  },
};
</script>

<style scoped></style>
