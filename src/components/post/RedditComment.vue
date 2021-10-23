<template>
  <ul
    :class="{ hovering }"
    @click.self="expanded = !expanded"
    @mouseover.self="hovering = true"
    @mouseout.self="hovering = false"
  >
    <li v-if="comment.body_html">
      <div
        class="d-flex align-center user-info my-2 pointer-cursor"
        @click="expanded = !expanded"
      >
        <v-avatar size="32" class="elevation-2 mr-2" color="white">
          <img
            :src="iconSrc"
            loading="lazy"
            rel="noopener noreferrer"
            referrerpolicy="no-referrer"
            alt=""
          />
        </v-avatar>
        <span class="text--secondary">
          {{ comment.author }}
        </span>
        <span
          v-if="comment.is_submitter"
          class="primary--text font-weight-bold mx-2"
        >
          OP
        </span>
        <v-icon v-if="!expanded" color="secondary" class="mr-2">
          unfold_more
        </v-icon>
      </div>
      <div v-if="expanded" v-html="comment.body_html" />
    </li>

    <li v-if="expanded">
      <reddit-comment
        v-for="reply in replies"
        :key="reply.data.id"
        :comment="reply.data"
      />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RedditComment",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      expanded: true,
      hovering: false,
    };
  },
  computed: {
    ...mapGetters(["avatarBase"]),
    replies() {
      return (this.comment.replies && this.comment.replies.data.children) || [];
    },
    iconSrc() {
      return `${this.avatarBase}/api/gridy/${this.comment.author_fullname}.svg`;
    },
  },
};
</script>

<style scoped lang="scss">
ul {
  box-sizing: border-box;
  list-style: none;
  padding-left: 24px;
  border-left: 2px solid var(--v-secondary-base);

  &.hovering {
    cursor: pointer;
    padding-left: 23px;
    border-left: 3px solid var(--v-secondary-lighten4);
  }
}

.user-info {
  margin-left: -40px;
}
</style>
