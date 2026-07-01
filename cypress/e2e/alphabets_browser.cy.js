describe("Alphabets Browser", () => {
  it("Works", () => {
    cy.visit("/alphabets");
    cy.contains("button.selected", "B").should("exist");
    cy.contains("a", "Bana").should("exist");
    cy.contains("button", "G").click();
    cy.contains("a", "Gude");
  });
});
