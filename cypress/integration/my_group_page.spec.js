describe("My Group Page", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/groups/111111111111111111111111");
  });

  it("Lists the users and alphabets", () => {
    cy.contains("li", "Titus");
    cy.contains("li", "Joel");
    cy.contains("li", "Bana");
    // Alphabet is a link
    cy.contains("a", "Bana").click();
    cy.location("pathname").should(
      "eq",
      "/alphabets/view/789def789def789def789def"
    );
  });

  it("Adds Users", () => {
    cy.contains("button", "Add").click();
    cy.placeholder("Name or email").type("lucy");
    cy.contains("li", "Lucy").click();
    cy.contains("Save").click();
    cy.contains("li", "Titus");
    cy.contains("li", "Lucy");
  });

  it("Removes users", () => {
    cy.contains("button", "Remove").click();
    cy.get("select").select("Joel");
    cy.contains("Save").click();
    cy.contains("li", "Joel").should("not.exist");
    cy.contains("button", "Remove").should("not.exist");
  });
});
