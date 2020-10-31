<template>
  <div class="home">
    <div>
      <a v-if="user.name" key="logout" href="#" @click="logout">Logout</a>
      <a v-else key="login" :href="loginUrl">Authorize</a>
      <h1>This me: {{ user.name }}</h1>
      <button @click="getMe">Get me?</button>
    </div>
    <main>
      <post-listing />
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PostListing from "@/components/PostListing";

export default {
  name: "Home",
  components: { PostListing },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "apiBase", "rSubs"]),
    loginUrl() {
      return new URL("/_oauth/authorize", this.apiBase).toString();
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
</style>
