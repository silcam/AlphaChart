describe("Chart Editor Settings", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Edit").click();
    cy.contains("Chart Settings").click();
  });

  it("Changes the font", () => {
    cy.get(".compChart").should("have.css", "font-family", "AndikaNewBasic");

    cy.contains("select", "Andika").select("CharisSIL-Literacy");
    cy.get(".compChart").should(
      "have.css",
      "font-family",
      "CharisSIL-Literacy"
    );
  });

  it("Changes Title font size", () => {
    cy.get(".alphaTitle").then(styleChecker("fontSize", "3em"));
    cy.withLabel("Title Font Size")
      .contains("button", "+")
      .click();
    cy.get(".alphaTitle").then(styleChecker("fontSize", "3.1em"));
  });

  it("Changes Subtitle font size", () => {
    cy.get(".alphaSubtitle").then(styleChecker("fontSize", "1.6em"));
    cy.withLabel("Subtitle Font Size")
      .contains("button", "+")
      .click();
    cy.get(".alphaSubtitle").then(styleChecker("fontSize", "1.7em"));
  });

  it("Changes Title position", () => {
    cy.withLabel("Title Position").select("Left");
    cy.get(".alphaTitle").should("have.css", "text-align", "left");
    cy.withLabel("Title Position").select("Right");
    cy.get(".alphaTitle").should("have.css", "text-align", "right");
  });

  it("Can hide the top alphabet", () => {
    cy.withLabel("Show Top Alphabet").click();
    cy.get(".alphasummary").should("be.hidden");

    // Should hide these inputs
    cy.contains("label", "Top Alphabet Font Size").should("not.exist");
    cy.contains("label", "Top Alphabet Spacing").should("not.exist");
    cy.contains("label", "Top Alphabet Style").should("not.exist");
  });

  it("Changes Top Alphabet font size", () => {
    cy.withLabel("Top Alphabet Font Size")
      .contains("button", "+")
      .click();
    cy.get(".alphasummary").then(styleChecker("fontSize", "1.7em"));
  });

  it("Changes Top Alphabet spacing", () => {
    cy.withLabel("Top Alphabet Spacing")
      .contains("button", "+")
      .click();
    cy.get(".alphasummary > div").should("have.css", "padding", "0px 1.28px");
  });

  it("Changes Top Alphabet Style", () => {
    cy.withLabel("Top Alphabet Style").select("Α");
    cy.contains(".alphasummary", "Α");
    cy.contains(".alphasummary", "α").should("not.exist");
  });

  it("Changes Letter font size", () => {
    cy.withLabel("Letter Font Size")
      .contains("button", "+")
      .click();
    cy.get(".letter").then(styleChecker("fontSize", "3.1em"));
  });

  it("Changes Letter order and position", () => {
    const checkStyles = (justifyContent, flexDirection) => {
      cy.get(".letter")
        .should("have.css", "justifyContent", justifyContent)
        .should("have.css", "flexDirection", flexDirection);
    };
    checkStyles("flex-start", "row");

    cy.withLabel("Reverse Letters").click();
    checkStyles("flex-end", "row-reverse");

    cy.withLabel("Letter Position").select("Center");
    checkStyles("center", "row-reverse");

    cy.withLabel("Letter Position").select("Split");
    checkStyles("space-between", "row-reverse");

    cy.withLabel("Letter Position").select("Right");
    checkStyles("flex-start", "row-reverse");

    cy.withLabel("Reverse Letter").click();
    checkStyles("flex-end", "row");
  });

  it("Changes Example Word font size", () => {
    cy.withLabel("Example Word Font Size")
      .contains("button", "+")
      .click();
    cy.contains("Done").click();
    cy.get(".exampleWord").then(nodes =>
      expect(nodes[0].parentNode.style.fontSize).to.equal("1.1em")
    );
  });

  it("Unbolds the key letter", () => {
    // Need an example word that actually has the key letter
    cy.get("input[value='Dog']")
      .clear()
      .type("Δογ");
    cy.contains("Done").click();
    cy.contains(".exampleWord span", "Δ").then(
      styleChecker("fontWeight", "bold")
    );

    cy.contains("Edit").click();
    cy.contains("Chart Settings").click();
    cy.withLabel("Bold Key Letter").click();
    cy.contains("Done").click();
    cy.contains(".exampleWord span", "Δ").then(
      styleChecker("fontWeight", "normal")
    );
  });

  it("Changes Last Row Filler font size", () => {
    cy.withLabel("Last Row Filler Font Size")
      .contains("button", "+")
      .click();
    cy.get(".lastRowFiller").then(styleChecker("fontSize", "1.1em"));
  });

  it("Changes Footer font size", () => {
    cy.withLabel("Footer Font Size")
      .contains("button", "+")
      .click();
    cy.get(".alphafooter").then(styleChecker("fontSize", "1.1em"));
  });

  it("Sets border thickness and color", () => {
    const selectors = [
      ".alpharow:first-child",
      ".alphacell",
      ".lastRowFiller",
      ".alphafooter"
    ];
    cy.get(".alphatable").should(
      "have.css",
      "border-color",
      "rgb(221, 221, 221)"
    );
    cy.get(".alphatable").should("have.css", "border-width", "2px 2px 0px 0px");
    selectors.forEach(selector => {
      cy.get(selector).should("have.css", "border-width", "0px 0px 2px 2px");
      cy.get(selector).should("have.css", "border-color", "rgb(221, 221, 221)");
    });

    cy.withLabel("Border Thickness")
      .contains("button", "+")
      .click();
    cy.get(".alphatable").should("have.css", "border-width", "4px 4px 0px 0px");
    selectors.forEach(selector =>
      cy.get(selector).should("have.css", "border-width", "0px 0px 4px 4px")
    );

    cy.withLabel("Border Color").click();
    cy.get("input[value='#DDDDDD']")
      .clear()
      .type("#0000FF");
    [...selectors, ".alphatable"].forEach(selector => {
      cy.get(selector).should("have.css", "border-color", "rgb(0, 0, 255)");
    });
  });

  it("Adjusts image size and position", () => {
    cy.contains(".letter", "β").click();
    cy.withLabel("Size")
      .contains("button", "+")
      .click()
      .click()
      .click();
    cy.get("img[alt='Boat']").then(styleChecker("width", "83%"));

    cy.withLabel("Image Position")
      .contains("button", "+")
      .click()
      .click()
      .click();
    cy.get("img[alt='Boat']").should("have.css", "padding-bottom", "6px");
  });

  it("Switches to Right-to-Left", () => {
    cy.get(".alphasummary").should("have.css", "flex-direction", "row");
    cy.contains(".alpharow", "Γ").should("have.css", "flex-direction", "row");
    cy.get(".lastRowFiller").should("have.css", "text-align", "left");
    cy.get(".alphafooter").should("have.css", "text-align", "left");

    cy.withLabel("Right to Left").click();
    cy.get(".alphasummary").should("have.css", "flex-direction", "row-reverse");
    cy.contains(".alpharow", "Γ").should(
      "have.css",
      "flex-direction",
      "row-reverse"
    );
    cy.get(".lastRowFiller").should("have.css", "text-align", "right");
    cy.get(".alphafooter").should("have.css", "text-align", "right");
  });
});

function styleChecker(style, value) {
  return nodes => {
    expect(nodes[0].style[style]).to.equal(value);
  };
}
