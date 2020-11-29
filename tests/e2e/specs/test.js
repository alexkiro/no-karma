// https://docs.cypress.io/api/introduction/api.html

describe("Basic check", () => {
  it("Visits the app root url", () => {
    cy.intercept(
      { method: "GET", url: "/api/v1/me" },
      {
        headers: {
          "access-control-allow-origin": window.location.origin,
          "Access-Control-Allow-Credentials": "true",
        },
        fixture: "anon/me.json",
      }
    );
    cy.intercept(
      { method: "GET", url: "/subreddits/mine/subscriber" },
      {
        headers: {
          "access-control-allow-origin": window.location.origin,
          "Access-Control-Allow-Credentials": "true",
        },
        fixture: "anon/subscriber.json",
      }
    );
    cy.intercept(
      { method: "GET", url: "/best" },
      {
        headers: {
          "access-control-allow-origin": window.location.origin,
          "Access-Control-Allow-Credentials": "true",
        },
        fixture: "anon/posts.json",
      }
    );

    cy.visit("/");
    cy.contains(".v-toolbar__title", "no-karma");
    cy.contains(
      ":nth-child(1) > .reddit-post > .text-h5",
      "This game use to be my life"
    );
  });
});
