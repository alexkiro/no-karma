import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["locales"]),
  },
  methods: {
    /**
     * Find and compute the "best" human readable relative
     * date string from the specified dates.
     *
     * @param dateTo {Date}, date to format
     * @param dateFrom {Date}, relative from date; defaults to
     *   current time
     * @param short {Boolean}
     * @return {string|*}
     */
    relativeDateString(dateTo, dateFrom = null, short = false) {
      if (!dateTo) return;
      const formatter = short
        ? this.locales.shortRelTime
        : this.locales.relTime;
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
      return formatter.format(...args).replace(" ago", "");
    },
  },
};
