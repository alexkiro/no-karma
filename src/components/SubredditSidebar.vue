<template>
  <aside class="subreddit-sidebar hidden-scroll">
    <nav>
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
        <div>
          {{ sub.url }}
        </div>
      </router-link>
    </nav>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SubredditSidebar",
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
  padding: 1rem 0;
  height: 100%;
  box-shadow: var(--shadow-16dp);
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

    margin-right: 1rem;
    //box-shadow: var(--shadow-02dp);

    text-decoration: none;

    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 50%;
    }

    & + .subreddit-icon {
      margin-top: 1.5rem;
    }
  }
}
//
//.subreddit-icon {
//  &.not-active {
//    opacity: 0.7;
//  }
//
//  &.active,
//  &:focus,
//  &:hover {
//    opacity: 1;
//    transform: scale(1.2);
//    box-shadow: var(--shadow-12dp);
//    border-color: var(--states-primary-overlay-hover);
//  }
//
//  &.active {
//    border-color: var(--states-primary-overlay-selected);
//  }
//}
</style>
