// https://docs.cypress.io/api/introduction/api.html

const sizes = [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [800, 1280],
  [414, 896],
  [375, 667],
  [360, 640],
];

sizes.forEach((size) => {
  describe(`Anonymous subreddit view (${size})`, () => {
    beforeEach(() => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.interceptXHR({ pathname: "/api/v1/me" }, { fixture: "anon/me.json" });
      cy.interceptXHR(
        { pathname: "/subreddits/mine/subscriber" },
        {
          fixture: "anon/subscriber.json",
        }
      );
      cy.interceptXHR({ pathname: "/best" }, { fixture: "anon/posts1.json" });
      cy.interceptXHR(
        { pathname: "/r/popular/best" },
        { fixture: "anon/posts2.json" }
      );
    });
    it("Check main page", () => {
      cy.visit("/");
      cy.contains(".v-toolbar__title", "no-karma");
      cy.contains(".reddit-post .post-title", "This game use to be my life");
    });
    it("Change to r/popular", () => {
      cy.visit("/");
      if (size[0] < 1264) {
        cy.get(".v-app-bar__nav-icon").click();
      }
      cy.get('[href="/r/popular"]').click();
      cy.contains(".v-toolbar__title", "popular");
      cy.contains(".reddit-post .post-title", "This is our new tree!");
    });
  });
});
