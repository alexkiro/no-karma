<template>
  <div class="home">
    <div v-if="me">
      <a v-if="userInfo" key="logout" href="#" @click="logout">Logout</a>
      <a v-else key="login" :href="loginUrl">Authorize</a>
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
export default {
  name: "Home",
  data() {
    return {
      me: null
    };
  },
  computed: {
    loginUrl() {
      return this.getApiURL("/_oauth/authorize").toString();
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
      this.me = await this.apiCall("GET", "/api/v1/me");
    },
    async logout() {
      await this.apiCall("POST", "/_oauth/revoke");
      await this.getMe();
    }
  }
};
</script>
