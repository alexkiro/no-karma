<template>
  <div class="home">
    <a :href="oauthAuthorizeURL">Authorize</a>
  </div>
</template>

<script>
import { getApiURL } from "@/lib/api";

export default {
  name: "Home",
  computed: {
    oauthAuthorizeURL() {
      return getApiURL("/_oauth/authorize").toString();
    }
  }
};
</script>
