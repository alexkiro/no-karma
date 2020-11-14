/***
 * Map getters and mutations from Vuex to computed properties, creating a
 * two way binding between the Vuex Store that can be used with v-model and
 * so on.
 *
 * @param items {Object}
 * @return {{}}
 */
export default function mapQueryRoutes(items) {
  const result = {};
  [...Object.entries(items)].forEach(([key, options]) => {
    result[key] = {
      get: function () {
        return this.$store.getters[options.getter];
      },
      set: function (value) {
        this.$store.commit(options.setter, value);
      },
    };
  });
  return result;
}
