<template>
  <div v-if="loaded" id="app">
    <subreddit-sidebar class="hidden-scroll col1" />
    <router-view class="router-view col2" />
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
  padding-left: 10rem;

  .col1 {
    position: fixed;
    height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
