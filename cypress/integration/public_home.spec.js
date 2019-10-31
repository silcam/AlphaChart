describe("Public Home Page Tests", function() {
  it("Visits the Public Home Page", function() {
    cy.visit("/");
    cy.contains("Log in");
    cy.contains("Alphabet Charts");
    cy.contains("Ελληνικα");
  });

  it("Can change the language", function() {
    cy.contains("Fr").click();
    cy.contains("Se connecter");

    // Language preserved across resets
    cy.visit("/");
    cy.contains("Se connecter");

    // Reset to english!
    cy.contains("En").click();
  });
});
