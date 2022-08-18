<template>
  <div v-html="htmlWithEmotes" />
</template>

<script>
export default {
  name: "MarkDown",
  props: {
    html: {
      type: String,
      required: true,
    },
    mediaMetadata: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    htmlWithEmotes() {
      let result = this.html;
      Object.entries(this.mediaMetadata || {}).forEach(([key, media]) => {
        const emoteId = key.split("|").slice(-1)[0];
        if (!emoteId || !media || !media.s || !media.s.u) return;

        const tag = `
          <img
            src="${media.s.u}"
            loading="lazy"
            referrerpolicy="no-referrer"
            width="${media.s.x}"
            height="${media.s.y}"
            alt=""
          />
        `;
        result = result.replace(`:${emoteId}:`, tag);
      });
      return result;
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
        const url = new URL(el.href);

        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.setAttribute("referrerpolicy", "no-referrer");

        // Check for URL that look like
        // https://preview.redd.it/vmak94hb2ei91.png
        if (url.origin === "https://preview.redd.it") {
          const mediaId = url.pathname.replace("/", "").split(".")[0];
          const media = this.mediaMetadata[mediaId];

          if (media) {
            el.innerHTML = `
              <img
                src="${media.s.u}"
                loading="lazy"
                referrerpolicy="no-referrer"
                width="${media.s.x}"
                height="${media.s.y}"
                alt=""
              />
            `;
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
