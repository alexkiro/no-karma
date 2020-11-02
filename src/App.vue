<template>
  <div v-if="loaded" id="app" :class="theme">
    <div class="col1">
      <subreddit-sidebar />
    </div>
    <div class="col2">
      <div style="text-align: center">
        <input id="theme-dark" v-model="theme" type="radio" value="dark" />
        <label for="theme-dark">dark</label>
        <input id="theme-light" v-model="theme" type="radio" value="light" />
        <label for="theme-light">light</label>
      </div>

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
      theme: "dark",
      loaded: false,
    };
  },
  mounted() {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      this.theme = "light";
    }
    this.$store.dispatch("initStore").then(() => (this.loaded = true));
  },
};
</script>

<style lang="less">
@import "./styles/reset";
@import "./styles/fonts";
@import "./styles/vars/base";
@import "./styles/vars/dark";
@import "./styles/vars/light";
@import "./styles/typography";
@import "./styles/theme";
@import "./styles/buttons";
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
    padding: 2rem;
  }
}
</style>
