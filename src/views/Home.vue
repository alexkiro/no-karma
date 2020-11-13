<template>
  <div class="home">
    <div>
      <h6>This me: {{ user.name }}</h6>
      <div>Current: {{ endpoint }}</div>

      <div>
        <router-link
          v-for="link in sortLinks"
          :key="link.params.sort"
          :to="link"
          class="link"
          active-class="active"
        >
          {{ link.params.sort }}
        </router-link>
      </div>
    </div>
    <main>
      <keep-alive :max="5">
        <post-listing :key="endpoint" :endpoint="endpoint" />
      </keep-alive>
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostListing from "@/components/PostListing";

const sortChoices = ["hot", "new", "top", "best", "controversial", "rising"];

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
      choices: sortChoices,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "apiBase", "rSubs"]),
    endpoint() {
      const parts = [""];
      if (this.subreddit) parts.push("r", this.subreddit);
      parts.push(this.sort);
      return parts.join("/");
    },
    sortLinks() {
      return sortChoices.map((sort) => {
        return {
          name: this.$route.name,
          params: { ...this.$route.params, sort },
        };
      });
    },
  },
};
</script>

<style scoped lang="scss">
main {
  display: flex;
  justify-content: center;
}

.link {
  &:hover {
    text-decoration: underline;
  }

  &.active {
    color: var(--secondary-200);
    font-weight: 500;

    &:hover {
      cursor: default;
      text-decoration: none;
    }
  }
}
</style>
