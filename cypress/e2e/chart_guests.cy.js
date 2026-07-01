describe("Guest User Menu", () => {
  beforeEach(() => {
    cy.logIn("Lucy");
    cy.visit("/alphabets/view/123abc123abc123abc123abc");
  });

  it("Removes guest users", () => {
    cy.contains("Guest Users").click();
    cy.contains("li", "Titus")
      .find("a")
      .click();
    cy.contains("li", "Titus").should("not.exist");

    cy.logIn("Titus");
    cy.visit("/alphabets/view/123abc123abc123abc123abc");
    cy.contains("button", "Export Chart");
    cy.contains("button", "Edit").should("not.exist");
  });

  it("Adds guest users", () => {
    cy.contains("Guest Users").click();
    cy.placeholder("Name or email").type("Joel");
    cy.contains("li", "Joel").click();
    cy.contains("button", "Save").click();
    cy.contains("ul", "Joel")
      .find("li")
      .should("have.length", 2);

    cy.logIn("Joel");
    cy.visit("/alphabets/view/123abc123abc123abc123abc");
    cy.contains("button", "Edit").should("exist");
  });
});
