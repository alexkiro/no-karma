<template>
  <ul
    :class="{ hovering }"
    @click.self="expanded = !expanded"
    @mouseover.self="hovering = true"
    @mouseout.self="hovering = false"
  >
    <li v-if="comment.body_html">
      <v-sheet
        v-ripple
        class="user-info d-flex align-center py-2 px-1 pointer-cursor"
        @click="expanded = !expanded"
      >
        <div class="user-avatar elevation-2 mr-2">
          <img
            :src="iconSrc"
            loading="lazy"
            referrerpolicy="no-referrer"
            alt=""
          />
        </div>
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
      </v-sheet>
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

<style lang="scss">
.theme--dark .comment-body {
  ul {
    border-color: var(--v-secondary-base);

    &.hovering {
      border-color: var(--v-secondary-lighten4);
    }
  }
}
.theme--light .comment-body {
  ul {
    border-color: var(--v-secondary-lighten5);

    &.hovering {
      border-color: var(--v-secondary-lighten3);
    }
  }
}
</style>

<style scoped lang="scss">
@import "~vuetify/src/styles/settings/_variables";

ul {
  box-sizing: border-box;
  list-style: none;
  padding-left: 24px;
  border-left-width: 2px;
  border-left-style: solid;

  &.hovering {
    cursor: pointer;
    padding-left: 23px;
    border-left-width: 3px;
  }
}

.user-avatar {
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 50%;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.user-info {
  margin-left: -44px;
}

@media #{map-get($display-breakpoints, 'md-and-down')} {
  ul {
    padding-left: 16px;
    &.hovering {
      padding-left: 15px;
    }
  }

  .user-avatar {
    width: 24px;
    height: 24px;
  }

  .user-info {
    margin-left: -32px;
  }
}
</style>
