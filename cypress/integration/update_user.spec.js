describe("Update User", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/users/me");
  });

  it("Updates user name", () => {
    cy.contains("h1", "Titus").should("exist");
    cy.placeholder("New Name").type("RT!");
    cy.contains("div", "Change Name")
      .find("button")
      .click();
    cy.contains("h1", "RT!").should("exist");
    cy.contains(".banner", "Changes saved").should("exist");
  });

  it("Update user email", () => {
    cy.placeholder("New Email").type("rt@yahoo.com");
    cy.contains("div", "Change Email")
      .find("button")
      .click();
    cy.contains(".banner", "Changes saved").should("exist");

    cy.contains("Titus ▼").click();
    cy.contains("Log out").click();
    cy.placeholder("Email").type("rt@yahoo.com");
    cy.placeholder("Password").type("minecraft");
    cy.contains("button", "Log in").click();
    cy.contains("Titus ▼").should("exist");
  });

  it("Rejects existing email addresses", () => {
    cy.placeholder("New Email").type("lucy@me.com");
    cy.contains("div", "Change Email")
      .find("button")
      .click();
    cy.contains(".banner", "Changes saved").should("not.exist");
    cy.contains(
      ".error",
      "A user already exists for that email address"
    ).should("exist");
  });

  it("Updates the password", () => {
    cy.placeholder("Current Password").type("minecraft");
    cy.placeholder("New Password").type("Do the Funky Chicken, Mattie");
    cy.placeholder("Confirm New Password").type("Do the Funky Chicken, Mattie");
    cy.contains("div", "Change Password")
      .find("button")
      .click();
    cy.contains(".banner", "Password changed").should("exist");

    cy.contains("Titus ▼").click();
    cy.contains("Log out").click();
    cy.placeholder("Email").type("titus@yahoo.com");
    cy.placeholder("Password").type("Do the Funky Chicken, Mattie");
    cy.contains("button", "Log in").click();
    cy.contains("Titus ▼").should("exist");
  });

  it("Handles wrong old password when changing password", () => {
    cy.placeholder("Current Password").type("wrong");
    cy.placeholder("New Password").type("Do the Funky Chicken, Mattie");
    cy.placeholder("Confirm New Password").type("Do the Funky Chicken, Mattie");
    cy.contains("div", "Change Password")
      .find("button")
      .click();
    cy.contains(".error", "The current password is incorrect.");
  });
});
