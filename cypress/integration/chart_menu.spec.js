describe("Chart Dropdown Menu", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
  });

  it("Archives charts", () => {
    cy.contains("Ελληνικα ▼").click();
    cy.contains("Archive").click();
    cy.location("pathname").should("eq", "/");
    cy.contains("Ελληνικα").should("not.exist");
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains(".banner", "404").should("exist");
  });

  it("Updates chart name", () => {
    cy.contains("Ελληνικα ▼").click();
    cy.contains("Change Name").click();
    cy.placeholder("New Name").type("Greekish");
    cy.contains("Save").click();
    cy.contains("Greekish ▼").should("exist");
  });
});
