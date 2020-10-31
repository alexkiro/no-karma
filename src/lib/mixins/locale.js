export default {
  methods: {
    relativeDateString(dateTo, dateFrom = null) {
      if (!dateTo) return;
      dateFrom = dateFrom || new Date();
      const seconds = (dateTo.getTime() - dateFrom.getTime()) / 1000;
      const years = dateTo.getFullYear() - dateFrom.getFullYear();
      const args = [
        [seconds / 60, "minutes"],
        [seconds / 3600, "hours"],
        [seconds / 86400, "days"],
        [seconds / 604800, "weeks"],
        [dateTo.getMonth() - dateFrom.getMonth() + 12 * years, "months"],
        [years, "years"],
      ]
        .map(([value, unit]) => [Math.ceil(value), unit])
        .filter(([value]) => Math.abs(value) > 0)
        .slice(-1)[0];

      if (!args) return "just now";
      return this.$store.getters.relativeTimeFormat.format(...args);
    },
  },
};
