<template>
  <aside class="subreddit-sidebar hidden-scroll" :class="{ collapsed }">
    <div class="sidebar-header large primary emphasis">
      <span v-if="!collapsed">no-karma</span>
      <button
        class="material-icons icon-button"
        @click="collapsed = !collapsed"
      >
        {{ collapsed ? "chevron_right" : "chevron_left" }}
      </button>
    </div>
    <!--    <input-->
    <!--      v-if="!collapsed"-->
    <!--      v-model="searchText"-->
    <!--      autofocus-->
    <!--      placeholder="Search..."-->
    <!--    />-->
    <nav class="subreddit-list">
      <div v-for="group in menuItems" :key="group.groupName" class="nav-group">
        <div class="nav-header overline">
          {{ collapsed ? "&middot;" : group.groupName }}
        </div>
        <router-link
          v-for="item in group.items"
          :key="item.display"
          v-tippy="{ content: item.display, placement: 'right' }"
          :to="item.to"
          class="subreddit-item"
          active-class="active"
          :exact="true"
        >
          <div class="subreddit-icon">
            <img
              v-if="item.img"
              :src="item.img"
              loading="lazy"
              rel="noopener noreferrer"
              referrerpolicy="no-referrer"
              :alt="item.display"
            />
            <span v-else class="material-icons">{{ item.icon }}</span>
          </div>
          <div v-if="!collapsed">
            {{ item.display }}
          </div>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";
import { includesLax } from "@/lib/utils";

export default {
  name: "SubredditSidebar",
  data() {
    return {
      searchText: "",
      collapsed: false,
    };
  },
  computed: {
    ...mapGetters(["rSubs"]),
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
};
</script>

<style scoped lang="less">
.subreddit-sidebar {
  user-select: none;
  background: var(--surface);
  background: var(--elevation-overlay-01dp);
  height: 100%;
  box-shadow: var(--shadow-16dp);
  width: 30rem;
  transition: all 0.3s var(--ease-function);

  .subreddit-list {
    margin-bottom: 25vh;
  }

  .nav-group + .nav-group {
    margin-top: 2rem;
  }

  .nav-header,
  .sidebar-header {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .sidebar-header {
    position: sticky;
    top: 0;
    box-shadow: var(--shadow-01dp);
  }

  .subreddit-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transition: all 0.3s var(--ease-function);
    padding: 0.5rem;

    &:hover {
      background-color: var(--states-surface-overlay-hover);
    }

    &.active {
      background-color: var(--states-surface-overlay-selected);
    }

    .subreddit-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--surface);
      box-shadow: var(--shadow-01dp);

      overflow: hidden;

      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;

      text-decoration: none;

      img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 50%;
      }

      .material-icons {
        font-size: 2rem;
        color: var(--on-surface-high-emphasis);
      }

      & + * {
        margin-left: 1rem;
      }
    }
  }

  &.collapsed {
    width: unset;

    .nav-header {
      justify-content: center;
    }
  }
}
</style>
