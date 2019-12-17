describe("Create an Alphabet Chart", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/alphabets/new");
  });

  it("Requires a name and creates a new chart for user account", () => {
    // Save button is disabled until name is entered
    cy.contains("button", "Save").should("be.disabled");

    cy.get("input[type=text]").type("Vowelly");
    cy.contains("label", "Titus").click();
    cy.contains("button", "Save").click();

    cy.location("pathname").should("contain", "/alphabets/view");
    cy.get("input[value='Vowelly'");
    cy.contains("Home").click();
    cy.contains("li", "Vowelly")
      .contains("Boys Team")
      .should("not.exist");
  });

  it("Creates a new chart for group account", () => {
    cy.get("input[type=text]").type("Vowelly");
    cy.contains("label", "Boys Team").click();
    cy.contains("button", "Save").click();

    cy.location("pathname").should("contain", "/alphabets/view");
    cy.get("input[value='Vowelly'");
    cy.contains("Home").click();
    cy.contains("li", "Vowelly")
      .contains("Boys Team")
      .should("exist");
  });
});
