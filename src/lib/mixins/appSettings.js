import { DEFAULTS } from "@/store/modules/settings";

export default {
  computed: {
    ...Object.fromEntries(
      Object.keys(DEFAULTS).map((key) => {
        return [
          key,
          {
            get: function () {
              return this.$store.getters[key];
            },
            set: function (value) {
              this.$store.commit("setOption", { key, value });
            },
          },
        ];
      })
    ),
  },
};
