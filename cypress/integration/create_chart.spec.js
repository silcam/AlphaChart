describe("Create an Alphabet Chart", () => {
  it("Requires a name and creates a new chart", () => {
    cy.logIn();
    cy.visit("/alphabets/new");

    // Save button is disabled until name is entered
    cy.contains("button", "Save").should("be.disabled");

    cy.get("input").type("Vowelly");
    cy.contains("button", "Save").click();

    cy.get("input[value='Vowelly'");
  });
});
