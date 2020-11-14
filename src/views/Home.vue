<template>
  <div class="home">
    <div>
      <!--      <div>-->
      <!--        <router-link-->
      <!--          v-for="link in sortLinks"-->
      <!--          :key="link.params.sort"-->
      <!--          :to="link"-->
      <!--          class="link"-->
      <!--          active-class="active"-->
      <!--        >-->
      <!--          {{ link.params.sort }}-->
      <!--        </router-link>-->
      <!--      </div>-->
    </div>
    <main>
      <keep-alive :max="5">
        <post-listing :key="endpoint" :endpoint="endpoint" />
      </keep-alive>
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostListing from "@/components/PostListing";

export default {
  name: "Home",
  components: { PostListing },
  props: {
    subreddit: {
      type: String,
      required: false,
      default: "",
    },
    sort: {
      type: String,
      required: false,
      default: "best",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "apiBase", "rSubs"]),
    endpoint() {
      const parts = [""];
      if (this.subreddit) parts.push("r", this.subreddit);
      parts.push(this.sort);
      return parts.join("/");
    },
    // sortLinks() {
    //   return sortChoices.map((sort) => {
    //     return {
    //       name: this.$route.name,
    //       params: { ...this.$route.params, sort },
    //     };
    //   });
    // },
  },
};
</script>

<style scoped lang="scss"></style>
