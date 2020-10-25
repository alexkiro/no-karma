<template>
  <div>
    {{ $route.query }}
  </div>
</template>

<script>
import { apiCall } from "@/lib/api";

export default {
  name: "OAuthRedirect",
  mounted() {
    this.completeOAuth();
  },
  methods: {
    async completeOAuth() {
      await apiCall("GET", "/_oauth/complete", this.$route.query);
      await this.$router.push({ name: "home" });
    }
  }
};
</script>

<style scoped></style>
