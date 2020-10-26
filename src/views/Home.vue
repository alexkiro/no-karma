<template>
  <div class="home">
    <div>
      <a v-if="user.name" key="logout" href="#" @click="logout">Logout</a>
      <a v-else key="login" :href="loginUrl">Authorize</a>
    </div>

    <div>
      <h1>This me: {{ user.name }}</h1>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      me: null,
    };
  },
  computed: {
    ...mapGetters(["user", "apiBase"]),
    loginUrl() {
      return new URL("/_oauth/authorize", this.apiBase).toString();
    },
  },
  methods: {
    ...mapActions(["apiCall"]),
    async logout() {
      await this.apiCall({ method: "POST", endpoint: "/_oauth/revoke" });
      await this.$store.dispatch("getMe");
    },
  },
};
</script>
