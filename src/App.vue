<template>
  <div v-if="loaded" id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await this.$store.dispatch("loadEnvConfig");
      this.loaded = true;
    },
  },
};
</script>

<style lang="less">
@import "./styles/reset";
@import "./styles/typography";
</style>
