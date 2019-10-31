describe("Public Chart View", () => {
  it("Visits chart (not logged in)", () => {
    cy.visit("/");
    cy.contains("Ελληνικα").click();
    cy.url().should("include", "/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Β β");
    cy.contains("Copy to My Alphabets").should("not.exist");
    cy.contains("Save Chart Image");
  });

  it("Visits chart (logged in as not-the-owner)", () => {
    cy.logIn("Lucy");
    cy.visit("/");
    cy.contains("Ελληνικα").click();
    cy.url().should("include", "/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Β β");
    cy.contains("Copy to My Alphabets");
    cy.contains("Save Chart Image");
  });
});
