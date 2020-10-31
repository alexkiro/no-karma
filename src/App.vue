<template>
  <div v-if="loaded" id="app">
    <div class="col1">
      <subreddit-sidebar />
    </div>
    <div class="col2">
      <router-view class="router-view" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import styles from "tippy.js/dist/tippy.css";

import SubredditSidebar from "@/components/SubredditSidebar";
export default {
  components: { SubredditSidebar },
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    this.$store.dispatch("initStore").then(() => (this.loaded = true));
  },
};
</script>

<style lang="less">
@import "./styles/reset";
@import "./styles/fonts";
@import "./styles/typography";
@import "./styles/misc";

#app {
  display: flex;

  .col1 {
    position: sticky;
    height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
  }

  .col2 {
    flex-grow: 1;
  }
}
</style>
