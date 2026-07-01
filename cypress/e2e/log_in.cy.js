describe("Log in and log out", () => {
  it("Rejects bad logins", () => {
    cy.visit("/");
    cy.placeholder("Email").type("titus@yahoo.com");
    cy.placeholder("Password").type("I hate pizza"); // Obviously wrong
    cy.contains("button", "Log in").click();
    cy.contains(".error", "Invalid Login").should("exist");
  });

  it("Logs people in and out", () => {
    cy.visit("/");
    cy.placeholder("Email").type("titus@yahoo.com");
    cy.placeholder("Password").type("minecraft");
    cy.contains("button", "Log in").click();
    cy.contains("My Alphabets").should("exist");

    cy.contains("Titus ▼").click();
    cy.contains("Log out").click();
    cy.contains("button", "Log in").should("exist");
  });
});
