<template>
  <div class="d-flex align-center justify-center fill-height">
    <v-card class="elevation-2">
      <v-card-title class="elevation-8 error">
        <v-icon left>{{ icon }}</v-icon>
        Oh no! It seems there was an error.
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ErrorView",
  data() {
    return {
      online: true,
    };
  },
  computed: {
    icon() {
      if (!this.online) return "offline_bolt";
      return "error";
    },
  },
  mounted() {
    this.online = navigator.onLine;
    window.addEventListener("online", this.onOnline);
  },
  beforeDestroy() {
    window.removeEventListener("online", this.onOnline);
  },
  methods: {
    async onOnline() {
      if (this.online === false) {
        await this.$store.dispatch("initStore");
        window.location.reload();
      }
      this.online = true;
    },
  },
};
</script>

<style scoped></style>
