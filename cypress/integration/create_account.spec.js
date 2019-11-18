import { API_VERSION } from "../../server/dist/client/src/models/Api";

describe("Create Account", () => {
  it("Creates accounts", () => {
    cy.visit("/");
    cy.contains("Create Account").click();
    fillInForm(cy);
    cy.contains("Create Account").click();
    cy.contains("Account Confirmation");
    cy.request("/test-email/last-mail").then(response => {
      const url = verificationUrl(response);
      cy.visit(url);
      cy.contains("Verifying");
      cy.contains("Account Verified");
      cy.placeholder("Password").type("I'm a dinosaur");
      cy.contains("button", "Log in").click();
      cy.contains("My Alphabets");
      cy.contains("Joel");
    });
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

  it("Rejects invalid verification codes", () => {
    cy.visit("/users/verify/123abc");
    cy.contains("Verifying");
    cy.contains("The verification code is invalid.");
  });

  it("Rejects duplicate email addresses during verification", () => {
    cy.request("POST", `/api/v/${API_VERSION}/users`, {
      email: "joel@alphachart.com",
      password: "I'm a dinosaur"
    });
    cy.request("/test-email/last-mail").then(response => {
      const url1 = verificationUrl(response);
      cy.request("POST", `/api/v/${API_VERSION}/users`, {
        email: "joel@alphachart.com",
        password: "I'm a dinosaur"
      });
      cy.request("/test-email/last-mail").then(response2 => {
        const url2 = verificationUrl(response2);
        cy.visit(url1);
        cy.contains("Account Verified");
        cy.visit(url2);
        cy.contains("A user already exists");
      });
    });
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

function verificationUrl(response) {
  const pattern = /(http.+?)"/;
  return pattern.exec(response.body.content)[1];
}
