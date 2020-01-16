describe("Public Chart View", () => {
  it("Visits chart (not logged in)", () => {
    cy.visit("/");
    cy.contains("Ελληνικα").click();
    cy.url().should("include", "/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.get(".compChart");
    cy.contains("button", "Copy to").should("not.exist");
    cy.contains("Export Chart");
  });

  it("Visits chart (logged in as not-the-owner)", () => {
    cy.logIn("Lucy");
    cy.visit("/");
    cy.contains("Ελληνικα").click();
    cy.url().should("include", "/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.get(".compChart");
    cy.contains("button", "Edit Chart").should("not.exist");
    cy.contains("button", "Copy to").should("exist");
    cy.contains("button", "Export Chart").should("exist");
  });
});
