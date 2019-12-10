import { API_VERSION } from "../../server/dist/client/src/models/Api";

describe("Chart Editor", () => {
  beforeEach(() => {
    cy.logIn();
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12");
    cy.contains("Edit").click();
  });

  it("Persists changes", () => {
    cy.withLabel("Add Letters").type("W ");
    cy.contains(".letter", "W").contains("w");
    cy.contains("Done").click();
    cy.contains(".letter", "W").contains("w");
    cy.visit("/alphabets/view/5d4c38e158e6dbb33d7d7b12"); // Reload the page
    cy.contains(".letter", "W").contains("w");
  });

  it("Adds letters", () => {
    const input = () => cy.withLabel("Add Letters");
    input().type("W "); // sep: space
    cy.contains(".letter", "W").contains("w");
    input().type("q,"); // sep: comma
    cy.contains(".letter", "Q").contains("q");
    input().type("H\n"); // sep: enter
    cy.contains(".letter", "H").contains("h");
    input().type("sh "); // digraph
    cy.contains(".letter", "Sh").contains("sh");
    input().type("tch ");
    cy.contains(".letter", "Tch").contains("tch");

    cy.contains("Done").click();
    cy.contains(".letter", "W").contains("w");
  });

  it("Edits Titles and footers", () => {
    cy.get(".alphaTitle > input")
      .clear()
      .type("Pizza");
    cy.get(".alphaSubtitle > input").type("With Pepperoni");
    cy.get(".lastRowFiller textarea").type("Copyright maybe?");
    cy.get(".alphafooter textarea").type("I'm at the very bottom");

    cy.contains("Done").click();
    cy.contains(".alphaTitle", "Pizza");
    cy.contains(".alphaSubtitle", "With Pepperoni");
    cy.contains(".lastRowFiller", "Copyright maybe?");
    cy.contains(".alphafooter", "I'm at the very bottom");
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

    cy.request(`/api/v/${API_VERSION}/alphabets/5d4c38e158e6dbb33d7d7b12`).then(
      response => {
        const imagePath = response.body.chart.letters[10].imagePath;
        cy.request(imagePath)
          .its("headers")
          .should("include", { "content-type": "image/png" });
      }
    );
  });

  it("Moves, adds & deletes letters", () => {
    cy.contains(".letter", "Α").click();

    // Move the letter
    cy.withLabel("Letter Position")
      .contains("button", "+")
      .click();
    cy.chartSnap("Alpha second");
    cy.withLabel("Letter Position")
      .contains("button", "-")
      .click();
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
