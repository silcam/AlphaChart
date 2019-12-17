describe("User Home Page", () => {
  it("Looks right for Titus", () => {
    cy.logIn();
    cy.visit("/");
    cy.contains("h2", "My Alphabets")
      .closest("div")
      .contains("Ελληνικα");
    cy.contains("h2", "My Alphabets")
      .closest("div")
      .contains("Gude");
    cy.contains("h2", "My Alphabets")
      .closest("div")
      .contains("Bana");
    cy.contains("h2", "Other Alphabets")
      .closest("div")
      .contains("Ελληνικα")
      .should("not.exist");
  });

  it("Looks right for Lucy", () => {
    cy.logIn("Lucy");
    cy.visit("/");
    cy.contains("h2", "My Alphabets")
      .closest("div")
      .contains("Ελληνικα")
      .should("not.exist");
    const greekLi = cy
      .contains("h2", "Other Alphabets")
      .closest("div")
      .contains("li", "Ελληνικα");
    greekLi.contains("Titus");
  });

  it("Has New Alphabet Button", () => {
    cy.logIn();
    cy.visit("/");
    cy.contains("New Alphabet Chart").click();
    cy.url().should("include", "/alphabets/new");
  });
});
