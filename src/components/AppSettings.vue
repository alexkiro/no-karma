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

      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="showNSFW"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content @click="showNSFW = !showNSFW">
          <v-list-item-title>Show NSFW</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-subheader>About</v-subheader>
      <v-list-item
        href="https://github.com/alexkiro/no-karma/"
        target="_blank"
        rel="noopener noreferrer"
        referrerpolicy="no-referrer"
      >
        <v-icon left class="mr-8">mdi-github</v-icon>
        Fork me on GitHub
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
      showNSFW: {
        getter: "showNSFW",
        setter: "setShowNSFW",
      },
    }),
  },
};
</script>

<style scoped></style>
