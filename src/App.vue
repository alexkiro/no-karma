<template>
  <v-app v-if="loaded" id="app">
    <subreddit-sidebar />

    <v-main>
      <v-switch
        v-model="$vuetify.theme.dark"
        dense
        append-icon="brightness_4"
        color="accent"
      />
      <router-view class="router-view" />
    </v-main>
  </v-app>
  <!--  <div v-if="loaded" id="app" :class="theme">-->
  <!--    <div class="col1">-->
  <!--      <subreddit-sidebar />-->
  <!--    </div>-->
  <!--    <div class="col2">-->
  <!--      <div style="text-align: center">-->
  <!--        <input id="theme-dark" v-model="theme" type="radio" value="dark" />-->
  <!--        <label for="theme-dark">dark</label>-->
  <!--        <input id="theme-light" v-model="theme" type="radio" value="light" />-->
  <!--        <label for="theme-light">light</label>-->
  <!--      </div>-->

  <!--      <router-view class="router-view" />-->
  <!--    </div>-->
  <!--  </div>-->
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
    this.$vuetify.theme.dark = this.getLocalStorage("theme") === "dark";
    this.$store.dispatch("initStore").then(() => (this.loaded = true));
  },
};
</script>

<style lang="scss">
@import "styles/misc";

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
