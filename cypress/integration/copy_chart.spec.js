describe("Copy chart button", () => {
  it("Copies charts to my Alphabets", () => {
    cy.logIn("Lucy");
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Copy to").click();
    cy.contains("td", "Lucy").click();

    cy.contains("By Lucy");
    cy.visit("/");
    cy.contains("h2", "My Alphabets")
      .closest("div")
      .contains("Ελληνικα");
  });
});
