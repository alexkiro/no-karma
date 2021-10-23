<template>
  <v-app v-if="loaded" id="app">
    <subreddit-sidebar />
    <v-main>
      <keep-alive :max="5">
        <router-view v-if="!error" :key="$route.fullPath" class="router-view" />
      </keep-alive>
      <error-view v-if="error" />
    </v-main>
  </v-app>
</template>

<script>
import EventBus from "@/lib/event-bus";
import SubredditSidebar from "@/components/SubredditSidebar";
import ErrorView from "@/views/ErrorView";

export default {
  components: { ErrorView, SubredditSidebar },
  data() {
    return {
      theme: "dark",
      loaded: false,
      error: false,
    };
  },
  watch: {
    "$vuetify.theme.dark"(dark) {
      this.setLocalStorage("theme", dark ? "dark" : "light");
    },
    $route() {
      this.error = false;
    },
  },
  mounted() {
    this.$vuetify.theme.dark =
      (this.getLocalStorage("theme") || "dark") === "dark";

    EventBus.$on(EventBus.events.apiReadError, this.onApiError);
    EventBus.$on(EventBus.events.apiUnknownError, this.onApiError);
    EventBus.$on(EventBus.events.apiConnectError, this.onApiError);

    this.$store.dispatch("initStore").finally(() => (this.loaded = true));
  },
  methods: {
    onApiError() {
      this.error = true;
    },
  },
};
</script>

<style lang="scss">
@import "styles/misc";
@import "styles/theme";
@import "styles/md";

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
