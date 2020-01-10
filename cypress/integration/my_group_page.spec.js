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
    cy.contains("button", "Manage").click();
    cy.placeholder("Name or email").type("lucy");
    cy.contains("li", "Lucy").click();
    cy.contains("Save").click();
    cy.contains("li", "Titus");
    cy.contains("li", "Lucy");
  });

  it("Removes users", () => {
    cy.contains("button", "Manage").click();
    cy.contains("ul", "T");
    cy.contains("li", "Joel")
      .find("button")
      .click();
    cy.contains("li", "Joel").should("not.exist");
  });

  it("Links to New Group Page", () => {
    cy.contains("Create").click();
    cy.contains("New Group").should("exist");
  });

  it("Links to New Alphabet Page", () => {
    cy.contains("button", "Add").click();
    cy.contains("h2", "New Alphabet").should("exist");
    cy.contains("label", "Boys Team")
      .find("input")
      .should("be.checked");
  });
});
