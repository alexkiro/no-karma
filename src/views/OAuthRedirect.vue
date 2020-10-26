<template>
  <div>
    {{ $route.query }}
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "OAuthRedirect",
  mounted() {
    this.completeOAuth();
  },
  methods: {
    ...mapActions(["apiCall"]),
    async completeOAuth() {
      await this.apiCall({
        method: "GET",
        endpoint: "/_oauth/complete",
        params: this.$route.query,
      });
      await this.$store.dispatch("initStore");
      await this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped></style>
