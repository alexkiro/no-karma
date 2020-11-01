<template>
  <aside class="subreddit-sidebar hidden-scroll" :class="{ collapsed }">
    <nav class="subreddit-list">
      <h6 class="nav-header primary emphasis">
        <span v-if="!collapsed">Communities</span>
        <button
          class="material-icons icon-button"
          @click="collapsed = !collapsed"
        >
          {{ collapsed ? "chevron_right" : "chevron_left" }}
        </button>
      </h6>
      <router-link
        v-for="sub in rSubs"
        :key="sub.name"
        v-tippy="{ content: sub.url, placement: 'right' }"
        :to="{
          name: 'home-sub',
          params: { subreddit: sub.display_name, sort: $route.params.sort },
        }"
        class="subreddit-item"
        :class="{ 'not-active': $route.params.subreddit }"
        active-class="active"
      >
        <div class="subreddit-icon">
          <img
            v-if="sub.community_icon || sub.icon_img"
            :src="sub.community_icon || sub.icon_img"
            loading="lazy"
            referrerpolicy="no-referrer"
            :alt="sub.display_name_prefixed"
          />
          <span v-else class="material-icons">public</span>
        </div>
        <div v-if="!collapsed">
          {{ sub.url.slice(1) }}
        </div>
      </router-link>
    </nav>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SubredditSidebar",
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    ...mapGetters(["rSubs"]),
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

  .subreddit-list {
    margin-bottom: 25vh;
  }

  .nav-header {
    position: sticky;
    top: 0;

    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    box-shadow: var(--shadow-01dp);
  }

  &.collapsed {
    width: unset;
  }
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
    background-color: white;
    overflow: hidden;

    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
    border: 1px solid var(--outline);

    //box-shadow: var(--shadow-02dp);

    text-decoration: none;

    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 50%;
    }

    .material-icons {
      font-size: 2.5rem;
      color: black;
    }

    & + * {
      margin-left: 1rem;
    }
  }
}
</style>
