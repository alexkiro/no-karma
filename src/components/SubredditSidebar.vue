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
        class="subreddit-icon"
        :class="{ 'not-active': $route.params.subreddit }"
        active-class="active"
      >
        <img
          v-if="sub.community_icon || sub.icon_img"
          :src="sub.community_icon || sub.icon_img"
          loading="lazy"
          referrerpolicy="no-referrer"
          :alt="sub.display_name_prefixed"
        />
        <span v-else class="material-icons">public</span>
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
  background-color: @background-dark;
  padding: 1rem 1.5rem;
  height: 100%;
}

.subreddit-icon {
  cursor: pointer;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  overflow: hidden;

  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 2px solid @border-normal;

  transition-property: transform;
  transition-delay: 10ms;
  transition-duration: 100ms;
  transition-timing-function: ease-in-out;

  text-decoration: none;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 50%;
  }

  & + .subreddit-icon {
    margin-top: 1.5rem;
  }

  &.not-active {
    opacity: 0.6;
  }

  &.active,
  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
