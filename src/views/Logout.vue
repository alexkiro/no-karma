<template>
  <double-bounce-spinner />
</template>

<script>
import DoubleBounceSpinner from "@/components/DoubleBounceSpinner";
import { mapActions } from "vuex";
export default {
  name: "Logout",
  components: { DoubleBounceSpinner },
  mounted() {
    this.$nextTick(this.logout);
  },
  methods: {
    ...mapActions(["apiCall", "clearStore", "initStore"]),
    async logout() {
      await this.apiCall({
        method: "POST",
        endpoint: "/_oauth/revoke",
      });
      await this.clearStore();
      await this.initStore();
      await this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped></style>
