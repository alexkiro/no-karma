<template>
  <div>
    <subreddit-header :subreddit="subreddit" />
    <main class="d-flex flex-grow-1 justify-space-around">
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
import { mapActions, mapGetters } from "vuex";
import SubredditHeader from "@/components/SubredditHeader";
import RedditPost from "@/components/post/RedditPost";

export default {
  name: "PostView",
  components: { RedditPost, SubredditHeader },
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
      post: null,
      comments: [],
    };
  },
  computed: {
    ...mapGetters(["postCache"]),
    commentsEndpoint() {
      return `/r/${this.subreddit}/comments/${this.postId}`;
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
        this.post = this.postCache.get(this.postId);
        this.comments = await this.apiCall({
          endpoint: this.commentsEndpoint,
          params: {
            sort: this.sort,
            sr_detail: false,
          },
        });
        if (!this.post && this.comments[0]) {
          this.post = this.comments[0].data.children[0].data;
        }
      } finally {
        this.initialLoading = false;
      }
    },
  },
};
</script>

<style scoped></style>
