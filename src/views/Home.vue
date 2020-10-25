<template>
  <div class="home">
    <div v-if="me">
      <a v-if="userInfo" key="logout" href="#" @click="logout">Logout</a>
      <a v-else :href="loginUrl" key="login">Authorize</a>
    </div>

    <div>
      <h1>This me: {{ userName }}</h1>
      <pre>
        {{ me }}
      </pre>
    </div>
  </div>
</template>

<script>
import { apiCall, getApiURL } from "@/lib/api";

export default {
  name: "Home",
  data() {
    return {
      me: null
    };
  },
  computed: {
    loginUrl() {
      return getApiURL("/_oauth/authorize").toString();
    },
    userInfo() {
      return this.me && this.me.subreddit;
    },
    userName() {
      return this.userInfo && this.userInfo.display_name_prefixed;
    }
  },
  mounted() {
    this.getMe();
  },
  methods: {
    async getMe() {
      this.me = await apiCall("GET", "/api/v1/me");
    },
    async logout() {
      await apiCall("POST", "/_oauth/revoke");
      await this.getMe();
    }
  }
};
</script>
