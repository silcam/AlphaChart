describe("New Group Page", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/groups/new");
  });

  it("Creates groups", () => {
    cy.placeholder("Name").type("More Pizza I Say");
    cy.contains("Save").click();
    cy.contains("h1", "More Pizza I Say").should("exist");
    cy.contains("div.compGroupsIndex li", "Titus").should("exist");
  });
});
