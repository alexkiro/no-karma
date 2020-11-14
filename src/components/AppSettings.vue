<template>
  <div>
    <v-list subheader min-width="17rem">
      <v-subheader>Settings</v-subheader>
      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="autoplayVideos"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content @click="autoplayVideos = !autoplayVideos">
          <v-list-item-title>Auto play videos</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="mutedVideos"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content @click="mutedVideos = !mutedVideos">
          <v-list-item-title>Muted videos</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item class="d-flex align-center justify-center">
        <v-switch
          v-model="$vuetify.theme.dark"
          dense
          append-icon="brightness_4"
          color="accent"
        />
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import mapStore from "@/lib/mapStore";

export default {
  name: "AppSettings",
  computed: {
    ...mapStore({
      autoplayVideos: {
        getter: "autoplayVideos",
        setter: "setAutoplayVideos",
      },
      mutedVideos: {
        getter: "mutedVideos",
        setter: "setMutedVideos",
      },
    }),
  },
};
</script>

<style scoped></style>
