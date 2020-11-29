<template>
  <div class="d-flex align-center justify-center fill-height">
    <v-card class="elevation-2">
      <v-card-title class="elevation-8 error">
        <v-icon left>offline_bolt</v-icon>
        Oh no! It seems you are offline
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "OfflineView",
  methods: {},
};
</script>

<style scoped></style>
