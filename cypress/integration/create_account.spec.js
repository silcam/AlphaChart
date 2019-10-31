describe("Create Account", () => {
  it("Creates accounts", () => {
    cy.visit("/");
    cy.contains("Create Account").click();
    fillInForm(cy);
    cy.contains("Create Account").click();
    cy.contains("My Alphabets");
    cy.contains("Joel");
  });

  it("Cancels just fine", () => {
    cy.visit("/");
    cy.contains("Create Account").click();
    cy.contains("Cancel").click();
    cy.contains("Log in");
  });

  it("Rejects invalid stuff", () => {
    cy.visit("/");
    cy.contains("Create Account").click();

    // Bad Email
    fillInForm(cy, { email: "uh" });
    cy.contains("Create Account").click();
    cy.contains("Email is invalid");

    // Bad Password
    fillInForm(cy, { password: "short", verify: "short" });
    cy.contains("Create Account").click();
    cy.contains("Please choose a password with");

    // Not matching password
    fillInForm(cy, { password: "what's wrong madeleine?" });
    cy.contains("Create Account").click();
    cy.contains("Passwords do not match");
  });

  it("Rejects duplicate users", () => {
    cy.visit("/");
    cy.contains("Create Account").click();
    fillInForm(cy, { email: "titus@yahoo.com" });
    cy.contains("Create Account").click();
    cy.contains("A user already exists");
  });
});

function fillInForm(cy, opts = {}) {
  cy.placeholder("Email")
    .clear()
    .type(opts.email || "joel@alphachart.com");
  cy.placeholder("Password")
    .clear()
    .type(opts.password || "I'm a dinosaur");
  cy.placeholder("Verify Password")
    .clear()
    .type(opts.verify || "I'm a dinosaur");
  cy.placeholder("Display Name")
    .clear()
    .type("Joel");
}
