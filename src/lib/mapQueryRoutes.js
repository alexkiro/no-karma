function parseBoolean(val) {
  return val.toString() === "true";
}

function getParseFunction(defaultValue) {
  switch (typeof defaultValue) {
    case "boolean":
      return parseBoolean;
    case "number":
      return Number;
    default:
      return String;
  }
}

/***
 * Map route query to computed properties, creating a
 * two way binding between the route params that can be
 * used with v-model and so on.
 *
 * @param items {Object}
 * @param replace {Boolean} If set to true use $route.replace, otherwise
 *   use $route.push.
 * @return {{}}
 */
export default function mapQueryRoutes(items, replace = true) {
  const result = {};
  [...Object.entries(items)].forEach(([key, defaultValue]) => {
    const parseFunction = getParseFunction(defaultValue);

    result[key] = {
      get: function () {
        const routeValue = this.$route.query[key];
        return routeValue === undefined
          ? defaultValue
          : parseFunction(routeValue);
      },
      set: async function (value) {
        const newRoute = {
          query: { ...this.$route.query },
        };
        const newValue = parseFunction(value);

        if (newValue === this[key]) {
          // Nothing to do if the new value is the same as the old.
          return;
        }

        if (newValue === defaultValue) {
          delete newRoute.query[key];
        } else {
          newRoute.query[key] = newValue;
        }

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
