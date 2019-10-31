describe("Chart Editor Settings", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Edit").click();
    cy.contains("Chart Settings").click();
  });

  it("Changes the font", () => {
    cy.contains("select", "Andika").select("CharisSIL-Literacy");
    cy.chartSnap("With Charis font");
  });

  it("Changes Title font size", () => {
    cy.withLabel("Title Font Size")
      .contains("button", "+")
      .click();
    cy.chartSnap("Title font 31");
  });

  it("Changes Subtitle font size", () => {
    cy.withLabel("Subtitle Font Size")
      .contains("button", "+")
      .click();
    cy.chartSnap("Subtitle font 17");
  });

  it("Changes Title position", () => {
    cy.withLabel("Title Position").select("Left");
    cy.chartSnap("Titles Left");
    cy.withLabel("Title Position").select("Right");
    cy.chartSnap("Titles Right");
  });

  it("Can hide the top alphabet", () => {
    cy.withLabel("Show Top Alphabet").click();
    cy.chartSnap("Without top alphabet");

    // Should hide these inputs
    cy.contains("label", "Top Alphabet Font Size").should("not.exist");
    cy.contains("label", "Top Alphabet Spacing").should("not.exist");
    cy.contains("label", "Top Alphabet Style").should("not.exist");
  });

  it("Changes Top Alphabet font size", () => {
    cy.withLabel("Top Alphabet Font Size")
      .contains("button", "+")
      .click();
    cy.chartSnap("Top Alphabet font 17");
  });

  it("Changes Top Alphabet spacing", () => {
    cy.withLabel("Top Alphabet Spacing")
      .contains("button", "+")
      .click();
    cy.chartSnap("Ever so slightly more spacing");
  });

  it("Changes Top Alphabet Style", () => {
    cy.withLabel("Top Alphabet Style").select("Α");
    cy.chartSnap("Uppercase Letters up top");
  });

  it("Changes Letter font size", () => {
    cy.withLabel("Letter Font Size")
      .contains("button", "+")
      .click();
    cy.chartSnap("Letter font 31");
  });

  it("Changes Example Word font size", () => {
    cy.withLabel("Example Word Font Size")
      .contains("button", "+")
      .click();
    cy.chartSnap("Example Word font 11");
  });

  it("Unbolds the key letter", () => {
    // Need an example word that actually has the key letter
    cy.get("input[value='Dog']")
      .clear()
      .type("Δογ");
    cy.contains("Done").click();
    cy.chartSnap("With bold key letters");

    cy.contains("Edit").click();
    cy.contains("Chart Settings").click();
    cy.withLabel("Bold Key Letter").click();
    cy.contains("Done").click();
    cy.chartSnap("Without bold key letters");
  });

  it("Changes Last Row Filler font size", () => {
    cy.withLabel("Last Row Filler Font Size")
      .contains("button", "+")
      .click();
    cy.chartSnap("Lasw Row Filler font 11");
  });

  it("Changes Footer font size", () => {
    cy.withLabel("Footer Font Size")
      .contains("button", "+")
      .click();
    cy.chartSnap("Footer font 11");
  });

  it("Sets border thickness and color", () => {
    cy.withLabel("Border Thickness")
      .contains("button", "+")
      .click();
    cy.withLabel("Border Color").click();
    cy.get("input[value='#DDDDDD']")
      .clear()
      .type("#0000FF");
    cy.chartSnap("Thick blue border");
  });
});
