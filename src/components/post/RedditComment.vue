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
        &nbsp;&middot;&nbsp;
        <span class="text--disabled">
          {{ relativeDateString(createdDate, null, true) }}
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
      <template v-for="(reply, index) in replies">
        <v-sheet
          v-if="reply.kind === 'more' && reply.data.count > 0"
          :key="reply.data.id + reply.kind"
          class="py-2 pointer-cursor primary--text"
          @click="loadMore(reply, index)"
        >
          <a>
            {{ reply.data.count }} more
            {{ reply.data.count === 1 ? "reply" : "replies" }}
          </a>
          <v-progress-circular
            v-if="loadingReplies"
            indeterminate
            color="grey lighten-5"
            size="16"
            class="mx-4"
          />
        </v-sheet>
        <reddit-comment
          v-else
          :key="reply.data.id + reply.kind"
          :comment="reply.data"
        />
      </template>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
      replies: [],
      loadingReplies: false,
    };
  },
  computed: {
    ...mapGetters(["avatarBase"]),
    createdDate() {
      return new Date(this.comment.created_utc * 1000);
    },
    iconSrc() {
      return `${this.avatarBase}/api/gridy/${this.comment.author_fullname}.svg`;
    },
  },
  watch: {
    "comment.replies"() {
      this.initReplies();
    },
  },
  mounted() {
    this.initReplies();
  },
  methods: {
    ...mapActions(["apiCall"]),
    initReplies() {
      this.replies =
        (this.comment.replies && [...this.comment.replies.data.children]) || [];
    },
    async loadMore(replyStub, index) {
      let response;
      try {
        this.loadingReplies = true;
        response = await this.apiCall({
          method: "GET",
          endpoint: "/api/morechildren",
          params: {
            link_id: this.comment.link_id,
            children: [replyStub.data.id, ...replyStub.data.children].join(","),
            api_type: "json",
            limit_children: false,
          },
        });
      } finally {
        this.loadingReplies = false;
      }

      const allReplies = {};
      response.json.data.things.forEach((thing) => {
        // Recreate the Reddit structure, for some reason comments
        // here have an empty string as "replies"
        thing.data.replies = {
          kind: "Listing",
          data: {
            children: [],
          },
        };
        allReplies[thing.data.name] = thing;
      });

      // Build comment tree, as the response is not threaded.
      Object.values(allReplies).forEach((thing) => {
        const parent = thing.data.parent_id;

        if (parent === this.comment.name) {
          // We are adding a sibling in the tree, push to the
          // main replies Array
          this.replies.push(thing);
        } else if (!allReplies[parent]) {
          // Something is wrong :/
          console.warn("Unable to find parent comment", thing);
        } else {
          allReplies[parent].data.replies.data.children.push(thing);
        }
      });

      // Remove the stub
      this.replies.splice(index, 1);
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
