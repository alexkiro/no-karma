<template>
  <div v-if="loaded" id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await this.$store.dispatch("loadEnvConfig");
      this.loaded = true;
    }
  }
};
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
