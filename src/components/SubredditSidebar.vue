<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="elevation-2"
      :mini-variant="mini"
      bottom
      fixed
    >
      <template #prepend>
        <v-list-item
          class="px-2 elevation-2"
          dense
          @click="!user.name && login()"
        >
          <v-list-item-avatar
            tile
            size="32"
            color="primary"
            class="elevation-2"
            @click="mini = false"
          >
            <v-img v-if="user.icon" :src="user.icon" />
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
              <a href="#" class="text-decoration-none text--primary">Login</a>
            </v-list-item-action-text>
          </v-list-item-content>

          <v-btn icon class="d-none d-sm-flex" @click="mini = true">
            <v-icon>chevron_left</v-icon>
          </v-btn>
          <v-btn icon class="d-flex d-sm-none" @click="drawer = false">
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
            :disabled="!mini"
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
                    rel="noopener noreferrer"
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
          v-if="hasMoreRSubs"
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
          mini = false;
        "
      />
      <v-toolbar-title class="pa-0 mr-2">
        <span>
          {{ this.$route.params.subreddit || "no-karma" }}
        </span>
      </v-toolbar-title>
      <v-spacer />
      <sort-switch class="mr-2" />
      <!-- TODO: Add full screen settings on mobile.  -->
      <v-menu
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
        <v-card>
          <app-settings />
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { includesLax } from "@/lib/utils";
import AppSettings from "@/components/AppSettings";
import SortSwitch from "@/components/SortSwitch";
import DoubleBounceSpinner from "@/components/DoubleBounceSpinner";

export default {
  name: "SubredditSidebar",
  components: { DoubleBounceSpinner, SortSwitch, AppSettings },
  data() {
    return {
      menu: false,
      drawer: true,
      mini: false,
      searchText: "",
    };
  },
  computed: {
    ...mapGetters(["user", "rSubs", "hasMoreRSubs"]),
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
      return this.rSubs.map((sub) => {
        return {
          to: {
            name: "home-sub",
            params: { subreddit: sub.display_name, sort: this.sort },
          },
          display: sub.display_name_prefixed,
          img: sub.community_icon || sub.icon_img,
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
  },
  watch: {
    mini(value) {
      this.setLocalStorage("drawerMini", value.toString());
    },
  },
  mounted() {
    this.mini = this.getLocalStorage("drawerMini") === "true";
    this.$nextTick(() => {
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
        this.mini = false;
      }
    });
  },
  methods: {
    ...mapActions(["apiCall", "loadRSubs"]),
    async login() {
      const response = await this.apiCall({
        method: "GET",
        endpoint: "/_oauth/authorize",
      });
      window.setTimeout(() => (window.location = response.url), 100);
    },
  },
};
</script>

<style scoped lang="scss"></style>
