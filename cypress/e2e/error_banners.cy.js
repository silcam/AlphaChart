describe("Error banners", () => {
  it("Shows server errors", () => {
    cy.intercept("GET", /\/api\/.*\/alphabets\//, { statusCode: 500, body: "" });
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains(".errorBanner", "Server Error: 500");

    // Close the banner
    cy.contains("a", "X").click();
    cy.get(".errorBanner").should("not.exist");

    // Banner closes itself on page change
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains(".errorBanner", "Server Error: 500");
    cy.contains("Groups").click();
    cy.get(".errorBanner").should("not.exist");
  });

  it("Takes too long", () => {
    // Delay the first quality request past the Axios timeout (2s via window variable).
    // Use a closure flag set immediately on first call (before the delay expires) so
    // subsequent quality requests skip the delay and go to the real server.
    // times:1 is NOT used here because Cypress doesn't consume it when Axios aborts.
    let tripped = false;
    cy.intercept("GET", /\/api\/.*\/alphabets\/quality/, (req) => {
      if (!tripped) {
        tripped = true;
        req.reply({ delay: 3000, statusCode: 200, body: "" });
      } else {
        req.continue();
      }
    });
    cy.visit("/", {
      onBeforeLoad: (win) => {
        win.__CYPRESS_AXIOS_TIMEOUT__ = 2000;
      }
    });
    cy.get(".errorBanner", { timeout: 10000 }).contains("No Connection");

    cy.contains(".successBanner", "Connection restored", { timeout: 10000 });
    cy.contains("Ελληνικα", { timeout: 10000 }).should("exist");
  });

  it("Has an old API", () => {
    // Verify the 410 response causes the "needs to update" banner with a "Reload" button.
    // Note: clicking Reload triggers window.location.reload() which resets Cypress intercept
    // state, making it impossible to reliably test the post-reload recovery in Cypress 13.
    cy.intercept("GET", /\/api\/.*\/alphabets\/quality/, {
      statusCode: 410,
      body: ""
    });
    cy.visit("/");
    cy.contains(".errorBanner", "needs to update");
    cy.contains("Reload");
  });
});
