<template>
  <div class="home">
    <div>
      <div>{{ endpoint }}</div>

      <a v-if="user.name" key="logout" href="#" @click="logout">Logout</a>
      <a v-else key="login" :href="loginUrl">Authorize</a>
      <h3>This me: {{ user.name }}</h3>

      <div>
        <button @click="getMe">Get me?</button>
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
      <keep-alive :max="3">
        <post-listing :key="endpoint" :endpoint="endpoint" />
      </keep-alive>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
    loginUrl() {
      return new URL("/_oauth/authorize", this.apiBase).toString();
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
  methods: {
    ...mapActions(["apiCall", "getMe"]),
    async logout() {
      await this.apiCall({ method: "POST", endpoint: "/_oauth/revoke" });
      await this.getMe();
    },
  },
};
</script>

<style scoped lang="less">
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
