describe("Chart Editor", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Edit").click();
  });

  it("Persists changes", () => {
    cy.withLabel("Add Letters").type("W ");
    cy.chartSnap("Chart with W");
    cy.contains("Done").click();
    cy.chartSnap("Chart View with W");
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12"); // Reload the page
    cy.chartSnap("Chart View Reloaded with W");
  });

  it("Adds letters", () => {
    const input = () => cy.withLabel("Add Letters");
    input().type("W "); // sep: space
    cy.chartSnap("Add W");
    input().type("q,"); // sep: comma
    cy.chartSnap("Add q");
    input().type("H\n"); // sep: enter
    cy.chartSnap("Add H");
    input().type("sh "); // digraph
    cy.chartSnap("Add sh");
    input().type("tch ");
    cy.chartSnap("Add tch"); // trigraph

    cy.contains("Done").click();
    cy.chartSnap("All done");
  });

  it("Edits Titles and footers", () => {
    cy.get(".alphaTitle > input")
      .clear()
      .type("Pizza");
    cy.get(".alphaSubtitle > input").type("With Pepperoni");
    cy.get(".lastRowFiller textarea").type("Copyright maybe?");
    cy.get(".alphafooter textarea").type("I'm at the very bottom");
    cy.chartSnap("Edit view");

    cy.contains("Done").click();
    cy.chartSnap("Public view");
  });

  it("Edits example words", () => {
    cy.get(":nth-child(4) > :nth-child(1) input[type='text']").type("Λογος");
    cy.chartSnap("With Logos");

    cy.contains("Done").click();
    cy.chartSnap("All done");
  });

  it("Adds images", () => {
    const dropZone = ":nth-child(4) > :first-child .drop-zone-root";
    const lambdaImage = ":nth-child(4) > :first-child img";

    cy.get(lambdaImage).should("not.exist");
    cy.fixture("apple.png", "base64").then(fileContent => {
      cy.get(dropZone).upload(
        { fileContent, fileName: "apple.png", mimeType: "image/png" },
        { subjectType: "drag-n-drop" }
      );
    });
    cy.get(lambdaImage);

    cy.contains("Done").click();
    cy.get(lambdaImage);
    cy.matchImageSnapshot("Chart Editor - Adds images - Lambda apple final");
  });

  it("Moves, adds & deletes letters", () => {
    cy.contains(".letter", "Α").click();

    // Move the letter
    cy.withLabel("Letter Position").contains("button", "+").click();
    cy.chartSnap("Alpha second");
    cy.withLabel("Letter Position").contains("button", "-").click();
    cy.chartSnap("Alpha first again");

    // Add a letter before
    cy.contains("button", "New letter before Α").click();
    cy.placeholder("Add form").type("F");
    cy.chartSnap("F as first letter");

    // Add a letter after
    cy.contains("button", "New letter after F").click();
    cy.placeholder("Add form").type("J");
    cy.chartSnap("J as second letter");

    // Delete a letter
    cy.contains("button", "Delete J").click();
    cy.chartSnap("No more J");

    cy.contains("Done").click();
    cy.chartSnap("All done");
  });

  it("Edits letter forms", () => {
    cy.contains(".letter", "Α").click();
    cy.contains(".side-menu", "Αα");
    cy.get(".side-menu")
      .get("input[value='Α']")
      .clear()
      .type("Q");
    cy.chartSnap("A to Q");
    cy.sideMenuSnap("SM A to Q");
    cy.get(".side-menu")
      .get("input[value='α']")
      .clear()
      .type("q");
    cy.chartSnap("a to q");
    cy.sideMenuSnap("SM a to q");
    cy.get(".side-menu input[value='']")
      .clear()
      .type("qw");
    cy.chartSnap("Third form - qw");
    cy.sideMenuSnap("SM Third form qw");

    cy.contains("Done").click();
    cy.chartSnap("All done");
  });

  it("Adds and deletes columns", () => {
    // Edit columns
    cy.contains("button", "+").click();
    cy.chartSnap("With 6 columns");
    cy.contains("Done").click();
    cy.chartSnap("Regular view with 6 columns");
    cy.contains("Edit").click();
    cy.contains("button", "-").click();
    cy.chartSnap("Back to 5 columns");
  });

  it("Opens and closes menus", () => {
    // Letter side menu
    cy.contains(".letter", "Β").click();
    cy.get(".letter-side-menu").should("be.visible");
    cy.contains(".side-menu a", "Close").click();
    cy.get(".letter-side-menu").should("not.be.visible");
    cy.contains(".letter", "Β").click();
    cy.get(".letter-side-menu").should("be.visible");
    cy.contains(".letter", "Β").click();
    cy.get(".letter-side-menu").should("not.be.visible");

    // Settings side menu
    cy.contains("Chart Settings").click();
    cy.get(".settings-side-menu").should("be.visible");
    cy.contains(".side-menu a", "Close").click();
    cy.get(".settings-side-menu").should("not.be.visible");
    cy.contains("Chart Settings").click();
    cy.get(".settings-side-menu").should("be.visible");
    cy.contains("Chart Settings").click({ force: true }); // With cypress resolution, the link is covered by the menu, but I still want to test it
    cy.get(".settings-side-menu").should("not.be.visible");

    // They close each other
    cy.contains("Chart Settings").click();
    cy.get(".settings-side-menu").should("be.visible");
    cy.contains(".letter", "Β").click();
    cy.get(".letter-side-menu").should("be.visible");
    cy.get(".settings-side-menu").should("not.be.visible");
    cy.contains("Chart Settings").click();
    cy.get(".letter-side-menu").should("not.be.visible");
    cy.get(".settings-side-menu").should("be.visible");
  });
});

function waitForSave(cy) {
  cy.server();
  cy.route("POST", "**/alphabets/5d4c38e158e6dbb33d7d7b12/charts").as(
    "postChart"
  );
  cy.wait("@postChart");
}
