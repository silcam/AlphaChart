describe("Copy chart button", () => {
  it("Copies charts to my Alphabets", () => {
    cy.logIn("Lucy");
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Copy to My Alphabets").click();

    cy.contains("Edit");
    cy.visit("/");
    cy.contains("h2", "My Alphabets")
      .closest("div")
      .contains("Ελληνικα");
  });
});
