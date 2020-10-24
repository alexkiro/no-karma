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
      const response = await apiCall(
        "GET",
        "/_oauth/complete",
        this.$route.query
      );
      console.log(response);
    }
  }
};
</script>

<style scoped></style>
