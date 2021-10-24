<template>
  <div>
    <v-list subheader min-width="17rem">
      <v-subheader>Settings</v-subheader>

      <v-list-item class="pointer-cursor" @click="showNSFW = !showNSFW">
        <v-list-item-action>
          <v-checkbox :input-value="showNSFW" />
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>NSFW</v-list-item-title>
          <v-list-item-subtitle>
            Don't blur over 18 posts
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        class="pointer-cursor"
        @click="showRedditLinks = !showRedditLinks"
      >
        <v-list-item-action>
          <v-checkbox :input-value="showRedditLinks" />
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>Reddit Links</v-list-item-title>
          <v-list-item-subtitle>
            Add links to the original posts on Reddit
          </v-list-item-subtitle>
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
      <v-subheader>Dark mode</v-subheader>
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
  data() {
    return {
      settings: [],
    };
  },
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
      showRedditLinks: {
        getter: "showRedditLinks",
        setter: "setShowRedditLinks",
      },
    }),
  },
};
</script>

<style scoped></style>
