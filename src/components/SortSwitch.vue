<template>
  <!--  <v-select v-model="sort" :items="sortChoices" />-->
  <v-btn-toggle v-model="sort" tile borderless>
    <v-btn
      v-for="sortChoice in sortChoices"
      :key="sortChoice.name"
      :value="sortChoice.name"
    >
      <v-icon>{{ sortChoice.icon }} </v-icon>
      <span class="hidden-sm-and-down pl-2">{{ sortChoice.name }}</span>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
const sortChoices = [
  { name: "best", icon: "home" },
  { name: "hot", icon: "whatshot" },
  { name: "new", icon: "flare" },
  { name: "top", icon: "leaderboard" },
  // { name: "controversial", icon: "whatshot" },
  // { name: "rising", icon: "trending_up" },
];
import mapParamRoutes from "@/lib/mapParamRoutes";

export default {
  name: "SortSwitch",
  data() {
    return {
      sortChoices,
    };
  },
  computed: {
    ...mapParamRoutes({ sort: "best" }),
  },
};
</script>

<style scoped></style>
