describe("Password Reset", () => {
  it("Resets my password", () => {
    cy.visit("/");
    cy.contains("Reset Password").click();
    cy.placeholder("Email").type("titus@yahoo.com");
    cy.contains("Submit").click();
    cy.contains(
      "An email with a password reset link was sent to titus@yahoo.com."
    ).should("exist");

    cy.request("/test-email/last-mail").then(response => {
      const url = verificationUrl(response);
      cy.visit(url);
      cy.contains("Verifying").should("exist");
      cy.contains("for Titus").should("exist");
      cy.placeholder("New Password").type("Time to go home already");
      cy.placeholder("Confirm New Password").type("Time to go home already");
      cy.contains("button", "Save").click();
      cy.contains(".banner", "Password changed.");
      cy.placeholder("Email").type("titus@yahoo.com");
      cy.placeholder("Password").type("Time to go home already");
      cy.contains("button", "Log in").click();
      cy.contains("Titus ▼").should("exist");
    });
  });

  it("Rejects bad emails", () => {
    cy.visit("/");
    cy.contains("Reset Password").click();
    cy.placeholder("Email").type("nemo@nope.com");
    cy.contains("Submit").click();
    cy.contains(".error", "There is no account with that email.").should(
      "exist"
    );
  });

  it("Rejects bad reset codes", () => {
    cy.visit("/users/passwordReset/nope-thats-not-right");
    cy.contains("Invalid reset key").should("exist");
  });
});

function verificationUrl(response) {
  const pattern = /(http.+?)"/;
  return pattern.exec(response.body.content)[1];
}
