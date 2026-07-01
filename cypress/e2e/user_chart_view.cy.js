describe("User Chart View", () => {
  it("Looks right for Titus", () => {
    cy.logIn();
    cy.visit("/");
    cy.contains("Ελληνικα").click();
    cy.contains("button", "Edit Chart");
    cy.contains("Home").click();
    cy.contains("Gude").click();
    cy.contains("button", "Edit Chart");
    cy.contains("Home").click();
    cy.contains("Bana").click();
    cy.contains("button", "Edit Chart");
  });

  it("Looks right for Lucy", () => {
    cy.logIn("Lucy");
    cy.visit("/");
    cy.contains("Ελληνικα").click();
    cy.contains("button", "Edit Chart").should("not.exist");
    cy.contains("Home").click();
    cy.contains("Gude").click();
    cy.contains("button", "Edit Chart");
    cy.contains("Home").click();
    cy.visit("/alphabets/view/789def789def789def789def"); // Bana
    cy.contains("button", "Edit Chart").should("not.exist");
  });
});
