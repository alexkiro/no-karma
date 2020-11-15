<template>
  <v-app v-if="loaded" id="app">
    <subreddit-sidebar />
    <v-main>
      <router-view class="router-view" />
    </v-main>
  </v-app>
</template>

<script>
import SubredditSidebar from "@/components/SubredditSidebar";
export default {
  components: { SubredditSidebar },
  data() {
    return {
      theme: "dark",
      loaded: false,
    };
  },
  watch: {
    "$vuetify.theme.dark"(dark) {
      this.setLocalStorage("theme", dark ? "dark" : "light");
    },
  },
  mounted() {
    this.$vuetify.theme.dark =
      (this.getLocalStorage("theme") || "dark") === "dark";
    this.$store.dispatch("initStore").then(() => (this.loaded = true));
  },
};
</script>

<style lang="scss">
@import "styles/misc";
@import "styles/theme";

@font-face {
  font-family: "Rubik";
  font-weight: 100 900;
  font-display: swap;
  src: url("./assets/fonts/Rubik-VariableFont_wght.ttf") format("truetype");
}

@font-face {
  font-family: "Rubik";
  font-style: italic;
  font-weight: 100 900;
  font-display: swap;
  src: url("./assets/fonts/Rubik-Italic-VariableFont_wght.ttf")
    format("truetype");
}

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
    position: relative;
    flex-grow: 1;
    padding: 2rem;
  }
}
</style>
