<template>
  <div>
    <subreddit-header :subreddit="subreddit" />
    <main class="d-flex flex-grow-1 justify-space-around">
      <div>
        <v-sheet max-width="55rem" class="my-4" :elevation="4">
          <reddit-post
            v-if="post"
            :post="post"
            :show-sub-reddit-info="false"
            :show-full-post="true"
          />
        </v-sheet>

        <v-sheet
          v-for="comment in comments"
          :key="comment.data.id"
          max-width="55rem"
          class="my-4 px-6 py-2 comment-body"
          :elevation="4"
        >
          <reddit-comment :comment="comment.data" />
        </v-sheet>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SubredditHeader from "@/components/SubredditHeader";
import RedditPost from "@/components/post/RedditPost";
import RedditComment from "@/components/post/RedditComment";

export default {
  name: "PostView",
  components: { RedditComment, RedditPost, SubredditHeader },
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
      x: [],
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
        const response = await this.apiCall({
          endpoint: this.commentsEndpoint,
          params: {
            sort: this.sort,
            sr_detail: false,
          },
        });
        if (!this.post && response[0]) {
          this.post = response[0].data.children[0].data;
        }

        this.comments = response[1].data.children;

        const ids = this.comments.map(
          (comment) => comment.data.author_fullname
        );
        this.x = await this.apiCall({
          endpoint: `/by_ids/${ids[0]}`,
        });
      } finally {
        this.initialLoading = false;
      }
    },
  },
};
</script>

<style scoped></style>
