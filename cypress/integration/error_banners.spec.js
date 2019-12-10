describe("Error banners", () => {
  it("Shows server errors", () => {
    // Show error banner for server 500
    cy.server();
    cy.route({ url: "**/alphabets/*", status: 500, response: "" });
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains(".errorBanner", "Server Error: 500");

    // Close the banner
    cy.contains("a", "X").click();
    cy.get(".errorBanner").should("not.exist");

    // Banner closes itself on page change
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains(".errorBanner", "Server Error: 500");
    cy.contains("Home").click();
    cy.get(".errorBanner").should("not.exist");
  });

  it("Takes too long", () => {
    cy.server();
    cy.route({ url: "**/alphabets", delay: 6000, response: [] });
    cy.visit("/");
    cy.contains(".compNavBar .compLoading", "...");
    cy.get(".errorBanner", { timeout: 6000 }).contains("No Connection");
    cy.contains(".successBanner", "Connection restored");
  });

  it("Has an old API", () => {
    cy.server();
    cy.route({ url: "**/alphabets", status: 410, response: "" });
    cy.visit("/");
    cy.contains(".errorBanner", "needs to update");

    // Reload the page
    cy.route("**/alphabets"); // Clear mock
    cy.contains("Reload").click();
    cy.contains("Ελληνικα");
  });
});
