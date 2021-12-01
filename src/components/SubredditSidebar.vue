<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="elevation-2"
      :mini-variant="drawerMini"
      fixed
    >
      <template #prepend>
        <v-list-item class="elevation-2 pl-3 pr-1" dense>
          <v-list-item-avatar
            tile
            size="32"
            color="primary"
            class="elevation-2"
            @click="drawerMini = false"
          >
            <img
              v-if="user.icon"
              :src="user.icon"
              loading="lazy"
              referrerpolicy="no-referrer"
              alt=""
            />
            <v-icon v-else dark>person</v-icon>
          </v-list-item-avatar>
          <v-list-item-content v-if="user.name">
            <v-list-item-title>
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-action-text>
              <router-link
                :to="{ name: 'logout' }"
                class="text-decoration-none text--primary"
              >
                Logout
              </router-link>
            </v-list-item-action-text>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-list-item-action-text class="anchor">
              <a :href="loginUrl" class="text-decoration-none text--primary">
                Login
              </a>
            </v-list-item-action-text>
          </v-list-item-content>

          <v-btn icon class="d-none d-lg-flex" @click="drawerMini = true">
            <v-icon>chevron_left</v-icon>
          </v-btn>
          <v-btn icon class="d-flex d-lg-none" @click="drawer = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-list-item>
      </template>
      <template #default>
        <v-list v-for="group in menuItems" :key="group.groupName">
          <v-list-item dense class="px-2">
            <v-list-item-subtitle>
              {{ group.groupName }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-tooltip
            v-for="item in group.items"
            :key="item.id"
            right
            :disabled="!drawerMini"
          >
            <template #activator="{ on, attrs }">
              <v-list-item
                :to="item.to"
                exact
                link
                class="px-2"
                dense
                v-bind="attrs"
                v-on="on"
              >
                <v-list-item-avatar class="elevation-2">
                  <img
                    v-if="item.img"
                    :src="item.img"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    :alt="item.display"
                    width="256px"
                    height="256px"
                  />
                  <v-icon v-else>{{ item.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>
                  {{ item.display }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <span> {{ item.display }}</span>
          </v-tooltip>
        </v-list>
        <div
          v-if="hasMoreSubscribedSubreddits"
          v-intersect="loadRSubs"
          class="load-more-trigger d-flex align-center justify-center"
        >
          <double-bounce-spinner class="my-12" />
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app dense fixed :hide-on-scroll="$vuetify.breakpoint.mobile">
      <v-app-bar-nav-icon
        class="d-flex d-lg-none"
        @click="
          drawer = !drawer;
          drawerMini = false;
        "
      />
      <v-toolbar-title class="pa-0 mr-2">
        <span>
          {{ $route.params.subreddit || "no-karma" }}
        </span>
      </v-toolbar-title>
      <v-spacer />
      <div class="d-flex align-center">
        <subreddit-search class="mx-4 d-none d-sm-block" />
        <sort-switch class="mr-2" />
      </div>
      <v-menu
        v-if="!$vuetify.breakpoint.mobile"
        v-model="menu"
        left
        bottom
        offset-y
        :close-on-content-click="false"
      >
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-card elevation="18">
          <app-settings />
        </v-card>
      </v-menu>

      <v-dialog
        v-else
        v-model="settingsDialog"
        fullscreen
        hide-overlay
        transition="dialog-top-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer />
            <v-btn icon dark @click="settingsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <app-settings />
        </v-card>
      </v-dialog>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { includesLax } from "@/lib/utils";
import AppSettings from "@/components/AppSettings";
import SortSwitch from "@/components/SortSwitch";
import DoubleBounceSpinner from "@/components/DoubleBounceSpinner";
import appSettings from "@/lib/mixins/appSettings";
import SubredditSearch from "@/components/SubredditSearch";
import mapQueryRoutes from "../lib/mapQueryRoutes";

export default {
  name: "SubredditSidebar",
  components: { SubredditSearch, DoubleBounceSpinner, SortSwitch, AppSettings },
  mixins: [appSettings],
  data() {
    return {
      menu: false,
      drawer: true,
      searchText: "",
    };
  },
  computed: {
    ...mapGetters([
      "user",
      "subscribedSubreddits",
      "hasMoreSubscribedSubreddits",
    ]),
    ...mapQueryRoutes(
      {
        settingsDialog: false,
      },
      false
    ),
    menuItems() {
      return [
        {
          groupName: "Feeds",
          items: this.feeds,
        },
        { groupName: "Communities", items: this.filteredCommunities },
      ];
    },
    sort() {
      return this.$route.params.sort;
    },
    feeds() {
      return [
        {
          to: {
            name: "home",
            params: { sort: this.sort },
          },
          display: "Home",
          icon: "home",
        },
        {
          to: {
            name: "home-sub",
            params: { subreddit: "popular", sort: this.sort },
          },
          display: "Popular",
          icon: "trending_up",
        },
        {
          to: {
            name: "home-sub",
            params: { subreddit: "all", sort: this.sort },
          },
          display: "All",
          icon: "apps",
        },
      ];
    },
    communities() {
      return this.subscribedSubreddits.map((sub) => {
        return {
          to: {
            name: "home-sub",
            params: { subreddit: sub.display_name, sort: this.sort },
          },
          display: sub.display_name_prefixed,
          img: this.getSubRedditIcon(sub),
          id: sub.id,
          icon: "public",
        };
      });
    },
    filteredCommunities() {
      if (!this.searchText) return this.communities;
      return this.communities.filter((item) =>
        includesLax(item.display, this.searchText)
      );
    },
    loginUrl() {
      return this.$store.getters.apiBase + "/_oauth/authorize";
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
        this.drawerMini = false;
      }
    });
  },
  methods: {
    ...mapActions(["apiCall", "loadRSubs"]),
  },
};
</script>

<style scoped lang="scss"></style>
