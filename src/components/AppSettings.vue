<template>
  <div>
    <v-list subheader min-width="17rem">
      <template v-for="group in options">
        <v-subheader :key="group.key">
          {{ group.groupName }}
        </v-subheader>

        <v-list-item
          v-for="option in group.items"
          :key="option.key"
          class="pointer-cursor"
          @click="toggleValue(option.key)"
        >
          <v-list-item-action>
            <v-checkbox :input-value="option.value" />
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              {{ option.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ option.description }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

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
    </v-list>
  </div>
</template>

<script>
import appSettings from "@/lib/mixins/appSettings";

export default {
  name: "AppSettings",
  mixins: [appSettings],
  computed: {
    options() {
      return [
        {
          key: "appearance",
          groupName: "Appearance",
          items: [
            {
              key: "darkTheme",
              name: "Dark theme",
              value: this.darkTheme,
              description: "Turn this on, don't strain your eyes",
            },
          ],
        },
        {
          key: "settings",
          groupName: "Settings",
          items: [
            {
              key: "openPostInNewTab",
              name: "Open post in new tab",
              value: this.openPostInNewTab,
              description: "Posts will be opened in a new tab by default",
            },
            {
              key: "showNSFW",
              name: "NSFW",
              value: this.showNSFW,
              description: "Don't blur over NSFW posts",
            },
            {
              key: "showRedditLinks",
              name: "Reddit links",
              value: this.showRedditLinks,
              description: "Add links to the original posts on Reddit",
            },
          ],
        },
      ];
    },
  },
  methods: {
    toggleValue(key) {
      this[key] = !this[key];
    },
  },
};
</script>

<style scoped></style>
