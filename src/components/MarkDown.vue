<template>
  <div v-html="html" />
</template>

<script>
export default {
  name: "MarkDown",
  props: {
    html: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(this.setSpoilerEvents);
  },
  methods: {
    showSpoiler(e) {
      e.target.classList.add("show");
    },
    setSpoilerEvents() {
      this.$el
        .querySelectorAll(".md-spoiler-text")
        .forEach((el) => el.addEventListener("click", this.showSpoiler));
    },
  },
};
</script>

<style scoped lang="scss"></style>
