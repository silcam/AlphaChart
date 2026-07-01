Cypress.Commands.add("acceptA4", () => {
  cy.contains("button", "OK").click();
});

// Parse a "W x H" string into [width, height]
function parseDims(text) {
  const m = text.match(/(\d+) x (\d+)/);
  return m ? [parseInt(m[1]), parseInt(m[2])] : [0, 0];
}

// Assert the chart's Actual dims fit within the Target dims and fill
// at least 85% on one dimension (i.e. the chart uses the paper well).
Cypress.Commands.add("assertActualFitsTarget", () => {
  cy.contains("pre", "Target :").invoke("text").then(targetText => {
    const [tw, th] = parseDims(targetText);
    cy.contains("pre", "Actual :").invoke("text").should(actualText => {
      const [aw, ah] = parseDims(actualText);
      expect(aw, "actual width ≤ target width").to.be.at.most(tw);
      expect(ah, "actual height ≤ target height").to.be.at.most(th);
      expect(
        Math.max(aw / tw, ah / th),
        "chart fills ≥85% on at least one dimension"
      ).to.be.at.least(0.85);
    });
  });
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
    cy.assertActualFitsTarget();

    // Adding a column should make the chart wider
    cy.contains("pre", "Actual :").invoke("text").then(beforeText => {
      const [bw] = parseDims(beforeText);
      cy.withLabel("Columns").contains("button", "+").click();
      cy.assertActualFitsTarget();
      cy.contains("pre", "Actual :").invoke("text").should(afterText => {
        expect(parseDims(afterText)[0]).to.be.greaterThan(bw);
      });
    });

    // Decreasing text size should make the chart shorter
    cy.contains("pre", "Actual :").invoke("text").then(beforeText => {
      const [, bh] = parseDims(beforeText);
      cy.withLabel("Text Size").contains("button", "-").click();
      cy.assertActualFitsTarget();
      cy.contains("pre", "Actual :").invoke("text").should(afterText => {
        expect(parseDims(afterText)[1]).to.be.lessThan(bh);
      });
    });

    cy.withLabel("Vertical Space").contains("+").click();
    cy.assertActualFitsTarget();

    cy.withLabel("Horizontal Space").contains("+").click();
    cy.assertActualFitsTarget();

    cy.get(".color-picker-preview").click();
    cy.get(".compColorInput input").clear().type("00FF00");
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
