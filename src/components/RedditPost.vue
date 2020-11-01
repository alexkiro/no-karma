<template>
  <div class="reddit-post">
    <div>{{ post.title }}</div>
    <div>u/{{ post.author }}</div>
    <div>{{ post.subreddit_name_prefixed }}</div>
    <img :src="post.thumbnail" loading="lazy" referrerpolicy="no-referrer" />
    <div>
      {{ locales.longDateTime.format(createdDate) }}
    </div>
    <div v-if="createdDate" v-tippy="{ content: createdDate }">
      <b>{{ relativeDateString(createdDate) }}</b>
    </div>
    <a :href="post.url_overridden_by_dest">
      {{ post.domain }}
    </a>
  </div>
</template>

<script>
export default {
  name: "RedditPost",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    createdDate() {
      return new Date(this.post.created_utc * 1000);
    },
  },
};
</script>

<style scoped lang="less">
.reddit-post {
  position: relative;
  background: var(--surface);
  background: var(--elevation-overlay-03dp);
  max-width: 100rem;
  padding: 2rem;
  border-radius: var(--rounded);
  box-shadow: var(--shadow-02dp);
  transition: all 0.3s var(--ease-function);

  &:hover {
    background-color: var(--states-surface-overlay-hover);
    box-shadow: var(--shadow-12dp);
  }

  & + .reddit-post {
    margin-top: 2rem;
  }
}
</style>
