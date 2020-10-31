<template>
  <div class="reddit-post">
    <div>{{ post.title }}</div>
    <div>u/{{ post.author }}</div>
    <div>{{ post.subreddit_name_prefixed }}</div>
    <img :src="post.thumbnail" loading="lazy" />
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
  background-color: @roman-silver;
  max-width: 75rem;
  padding: 2rem;
  border-radius: @border-radius;

  & + .reddit-post {
    margin-top: 2rem;
  }
}
</style>
