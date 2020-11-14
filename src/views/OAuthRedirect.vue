<template>
  <double-bounce-spinner />
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DoubleBounceSpinner from "@/components/DoubleBounceSpinner";

export default {
  name: "OAuthRedirect",
  components: { DoubleBounceSpinner },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.completeOAuth();
  },
  methods: {
    ...mapActions(["apiCall"]),
    async completeOAuth() {
      if (!this.user.name) {
        // TODO, catch error and redirect to an error page.
        await this.apiCall({
          method: "GET",
          endpoint: "/_oauth/complete",
          params: this.$route.query,
        });
      }
      await this.$store.dispatch("initStore");
      await this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped></style>
