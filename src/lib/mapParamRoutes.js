/***
 * Map route params to computed properties, creating a
 * two way binding between the route params that can be
 * used with v-model and so on.
 *
 * @param items {Object}
 * @param replace {Boolean} If set to true use $route.replace, otherwise
 *   use $route.push.
 * @return {{}}
 */
export default function mapParamRoutes(items, replace = true) {
  const result = {};
  [...Object.entries(items)].forEach(([key, defaultValue]) => {
    result[key] = {
      get: function () {
        return this.$route.params[key] || defaultValue;
      },
      set: async function (value) {
        const newRoute = {
          params: { ...this.$route.params },
        };
        const newValue = value;

        if (newValue === this[key]) {
          // Nothing to do if the new value is the same as the old.
          return;
        }

        newRoute.params[key] = newValue;

        if (replace) {
          await this.$router.replace(newRoute);
        } else {
          await this.$router.push(newRoute);
        }
      },
    };
  });
  return result;
}
