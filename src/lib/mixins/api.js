class APIError extends Error {
  constructor(message, details) {
    message = `${message}: ${details.detail}`;
    super(message);
    Object.assign(this, details);
    this.name = "APIError";
  }
}

async function _processJSONResponse(response) {
  if (response.status === 204) {
    // 204 (No Content)
    return {};
  }
  const contentType = response.headers
    .get("Content-Type")
    .split(";")[0]
    .trim();
  // We don't know what to do with anything other than a JSON
  // so just quit here and don't read the body.
  if (contentType !== "application/json") {
    throw new APIError("Unknown API error", {
      requestURL: response.url,
      statusCode: response.status,
      detail: response.statusText
    });
  }

  let jsonBody;
  jsonBody = await response.json();

  jsonBody.requestURL = new URL(response.url);
  jsonBody.statusCode = response.status;

  if (!response.ok) {
    // We got an expected error from the API, the error handling
    // is passed to the component calling the API.
    throw new APIError("API Error", jsonBody);
  }
  // Success
  return jsonBody;
}

export default {
  methods: {
    getApiURL: function(endpoint, params = {}) {
      let url;
      if (!endpoint) return;

      if (endpoint.startsWith(this.$store.getters.apiBase)) {
        url = new URL(endpoint);
      } else {
        url = new URL(this.$store.getters.apiBase + endpoint);
      }

      if (!Array.isArray(params)) {
        params = Object.entries(params);
      }
      params.forEach(entry => {
        url.searchParams.append(entry[0], entry[1]);
      });
      url.searchParams.append("raw_json", "1");
      return url;
    },
    apiCall: async function(
      method = "GET",
      endpoint = "/",
      params = {},
      data = undefined,
      contentType = "application/json",
      cacheMode = "no-cache"
    ) {
      const url = this.getApiURL(endpoint, params);
      const fetchOptions = {
        method,
        mode: "cors",
        cache: cacheMode,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        redirect: "follow"
      };

      if (data) {
        switch (contentType) {
          case "multipart/form-data":
            fetchOptions.body = new FormData();
            Object.entries(data).forEach(value => {
              fetchOptions.body.append(...value);
            });
            break;
          case "application/json":
            fetchOptions.headers["Content-Type"] = contentType;
            fetchOptions.body = JSON.stringify(data);
            break;
          default:
            fetchOptions.headers["Content-Type"] = contentType;
            fetchOptions.body = data;
        }
      }

      const response = await fetch(url.toString(), fetchOptions);
      return await _processJSONResponse(response);
    }
  }
};
