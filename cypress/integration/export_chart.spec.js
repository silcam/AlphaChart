Cypress.Commands.add("acceptA4", () => {
  cy.contains("button", "OK").click();
});

// Cypress.Commands.add("assertPreviewFits", () => {
//   const previewDims = nodeDims(cy, "chartToPreview");
//   const windowDims = nodeDims(cy, "previewWindow");
//   previewDims.forEach((pDim, i) => expect(pDim).at.most(windowDims[i]));
//   expect(previewDims.some((pDim, i) => pDim > windowDims[i] * 0.9)).to.be.true;
// });

describe("Export Chart", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Export Chart").click();
  });

  it("Picks paper options", () => {
    cy.contains("label", "Landscape").click();
    cy.contains("OK").click();
    cy.contains("Target : 3210 x 2190").should("exist");

    cy.contains("Paper Options").click();
    cy.withLabel("DPI").select("150");
    cy.contains("OK").click();
    cy.contains("Target : 1605 x 1095").should("exist");

    cy.contains("Paper Options").click();
    cy.withLabel("Paper Size").select("Custom");
    cy.inLabel("Width")
      .clear()
      .type("1024");
    cy.inLabel("Height")
      .clear()
      .type("768");
    cy.inLabel("Units").select("px");
    cy.contains("label", "DPI").should("not.exist");
    cy.contains("OK").click();
    cy.contains("Target : 1024 x 768").should("exist");
  });

  it("Responds to options", () => {
    cy.acceptA4();
    cy.contains("2190 x 2852").should("exist");

    cy.withLabel("Columns")
      .contains("button", "+")
      .click();
    cy.contains("2190 x 2328").should("exist");

    cy.withLabel("Text Size")
      .contains("button", "-")
      .click();
    cy.contains("2190 x 2234").should("exist");

    cy.withLabel("Vertical Space")
      .contains("+")
      .click();
    cy.contains("2190 x 2255").should("exist");

    cy.withLabel("Horizontal Space")
      .contains("+")
      .click();
    cy.contains("2190 x 2243").should("exist");

    cy.get(".color-picker-preview").click();
    cy.get("input[value='#FFFFFF']")
      .clear()
      .type("#00FF00");
    cy.get(".color-picker-preview").click();
    cy.get("#chartToPreview").should(
      "have.css",
      "background-color",
      "rgb(0, 255, 0)"
    );

    cy.contains("label", "Transparent").click();
    cy.get("#chartToPreview").should(
      "have.css",
      "background-color",
      "rgb(153, 153, 153)"
    );
  });

  it("Quits", () => {
    cy.contains("h3", "Export Chart").should("exist");
    cy.contains("Cancel").click();
    cy.contains("h3", "Export Chart").should("not.exist");
    cy.contains("button", "Export Chart").click();
    cy.acceptA4();
    cy.contains("h3", "Export Chart").should("exist");
    cy.contains("Done").click();
    cy.contains("h3", "Export Chart").should("not.exist");
  });

  it("Saves", () => {
    cy.visit("/alphabets/view/123abc123abc123abc123abc");
    cy.contains("Export Chart").click();
    cy.acceptA4();
    cy.contains("Save Image").click();
    cy.contains("label", "Saving...").should("exist");
    cy.contains("button", "Save Image").should("not.exist");
    cy.contains("label", "Saving...").should("not.exist");
    cy.contains("button", "Save Image").should("exist");

    cy.contains("Save PDF").click();
    cy.contains("label", "Saving...").should("exist");
    cy.contains("button", "Save PDF").should("not.exist");
    cy.contains("label", "Saving...").should("not.exist");
    cy.contains("button", "Save PDF").should("exist");
  });
});

// function nodeDims(cy, id) {
//   const node = cy.get(`#${id}`);
//   return node ? [node.offsetWidth, node.offsetHeight] : [1, 1];
// }
