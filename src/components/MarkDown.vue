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
    this.$nextTick(this.postProcess);
  },
  methods: {
    showSpoiler(e) {
      e.target.classList.add("show");
    },
    postProcess() {
      this.$el
        .querySelectorAll(".md-spoiler-text")
        .forEach((el) => el.addEventListener("click", this.showSpoiler));

      this.$el.querySelectorAll("a").forEach((el) => {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.setAttribute("referrerpolicy", "no-referrer");
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
