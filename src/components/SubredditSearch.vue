<template>
  <v-autocomplete
    class="search-input"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    color="white"
    item-value="id"
    placeholder="Start typing to Search"
    return-object
    hide-details
    prepend-inner-icon="search"
    append-icon=""
    :menu-props="{
      closeOnContentClick: true,
    }"
    :filter="() => true"
  >
    <template #item="{ item }">
      <v-list-item :to="item.to" exact link dense class="search-result">
        <v-list-item-avatar class="elevation-2">
          <img
            v-if="item.img"
            :src="item.img"
            loading="lazy"
            referrerpolicy="no-referrer"
            :alt="item.display"
            width="256px"
            height="256px"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.display }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ item.description }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { debounce } from "@/lib/utils";

export default {
  name: "SubredditSearch",
  data: () => ({
    descriptionLimit: 60,
    searchResults: [],
    isLoading: false,
    search: null,
  }),
  computed: {
    ...mapGetters(["subscribedSubreddits"]),
    items() {
      return (
        this.searchResults.length > 0
          ? this.searchResults
          : this.subscribedSubreddits
      ).map(this.getSearchResult);
    },
  },
  watch: {
    search: debounce(async function () {
      // Items have already been requested
      if (this.isLoading) return;

      if (!this.search) {
        this.searchResults = [];
        return;
      }

      this.isLoading = true;

      try {
        const response = await this.apiCall({
          endpoint: "/subreddits/search",
          params: {
            q: this.search,
            sr_detail: true,
            typeahead_active: true,
          },
        });
        this.searchResults = response.data.children.map(({ data }) => data);
      } finally {
        this.isLoading = false;
      }
    }, 200),
  },
  methods: {
    ...mapActions(["apiCall"]),
    getSearchResult(sub) {
      return {
        id: sub.id,
        to: {
          name: "home-sub",
          params: { subreddit: sub.display_name },
        },
        img: this.getSubRedditIcon(sub),
        display: sub.display_name_prefixed,
        description: sub.public_description,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.search-input {
  max-width: 34rem;
}

.search-result {
  max-width: 30rem;
}
</style>
