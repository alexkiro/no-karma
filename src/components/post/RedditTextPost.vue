<template>
  <mark-down
    class="flex-grow-1 text-post"
    :class="{
      overflowing: isOverflowing,
    }"
    :html="postText"
  />
</template>

<script>
import MarkDown from "@/components/MarkDown";
export default {
  name: "RedditTextPost",
  components: { MarkDown },
  props: {
    postText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOverflowing: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkIfOverflowing();
    });
  },
  methods: {
    checkIfOverflowing() {
      this.isOverflowing =
        this.$el && this.$el.scrollHeight > this.$el.clientHeight;
    },
  },
};
</script>

<style scoped lang="scss">
.text-post {
  max-height: 36rem;
  overflow: hidden;

  &.overflowing {
    mask-image: linear-gradient(180deg, #000 80%, transparent);
  }
}

.text-post .embedded-media {
  object-fit: contain;
  outline: none;
  border: none;
  overflow: hidden;
  margin: 0 auto;
}
</style>
