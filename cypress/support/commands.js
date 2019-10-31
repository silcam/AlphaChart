// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { API_VERSION } from "../../server/dist/client/src/models/Api";

// Libraries
require("@cypress/snapshot").register();
import "cypress-file-upload";
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";
addMatchImageSnapshotCommand();

// Load Fixtures
beforeEach(() => {
  cy.request("POST", "/test-db/load-fixtures");
});

// Find input by placeholder
Cypress.Commands.add("placeholder", placeholder => {
  return cy.get(`input[placeholder='${placeholder}']`);
});

// Log in
Cypress.Commands.add("logIn", user => {
  let loginAttempt;
  switch (user) {
    case "Lucy":
      loginAttempt = { email: "lucy@me.com", password: "princess" };
      break;
    case "Titus":
    default:
      loginAttempt = { email: "titus@yahoo.com", password: "minecraft" };
  }
  cy.request("POST", `/api/v/${API_VERSION}/users/login`, loginAttempt);
});

// Snapshot commands
Cypress.Commands.add("chartSnap", name => {
  cy.get(".compChart").snapshot({ name });
});
Cypress.Commands.add("sideMenuSnap", name => {
  cy.get(".side-menu").snapshot({ name });
});
