import {
  Given,
  And,
  Then,
  When,
  Before,
} from "cypress-cucumber-preprocessor/steps";

Given("I choose to share my note {string}", (noteTitle) => {
  cy.visitMyNotebooks();
  cy.findNoteCardButton(noteTitle, ".share-card").click();
})

Then("I should see {string} is shared in the Bazaar", (noteTitle) => {
  cy.visit("/bazaar");
  cy.findByText(noteTitle);
})

Then("note {string} is shared to the Bazaar", (noteTitle) => {
  cy.request({
      method: "POST",
      url: "/api/testability/share_to_bazaar",
      body: { noteTitle }
  }) .then((response) => {
    expect(response.status).to.equal(200);
  });
});

Then("there shouldn't be any note edit button for {string}", (noteTitle) => {
  cy.findNoteCardEditButton(noteTitle).should("not.exist");
});

When("I open the note {string} in the Bazaar", (noteTitle) => {
  cy.findByText(noteTitle).click();
});

When("I open the note {string} in the Bazaar in article view", (noteTitle) => {
  cy.findByText(noteTitle).click();
  cy.findByRole('button', {name: "Article View"}).click();
});

When("I should see in the article:", (data) => {
  data.hashes().forEach(({level, title}) => {
      cy.findByText(title, {selector: '.'+level}).should("be.visible");
  });
});

When("I should not see {string} in the article", (content) => {
  cy.findByText(content).should("not.exist");
});

When("I go to the bazaar", () => {
  cy.visit("/bazaar");
});

When("I should see two bullets in the article", () => {
  cy.get("body").find('li.article-view').should('have.length', 2);
});

When("I should see {string} as non-title in the article", (content) => {
      cy.findByText(content, {selector: '.note-body'});
});



When("I subscribe to note {string} in the bazaar, with target of learning {int} notes per day", (noteTitle, count) => {
  cy.visit("/bazaar");
  cy.subscribeToNote(noteTitle, count);
});

Then("I should not see the {string} button on note {string}", (btnClass, noteTitle) => {
  cy.findNoteCardButton(noteTitle, "." + btnClass).should("not.exist");
});

Then("I should see the {string} button on note {string}", (btnClass, noteTitle) => {
  cy.findNoteCardButton(noteTitle, "." + btnClass).should("exist");
});

Then("I should see readonly note {string} in my notes", (noteTitle) => {
  cy.visitMyNotebooks();
  cy.findNoteCardButton(noteTitle, ".edit-card").should("not.exist");
});

Then("I should see I've subscribed to {string}", (noteTitle) => {
  cy.findByText(noteTitle).should("be.visible");
});

Then("I should be able to edit the subscription to note {string}", (noteTitle) => {
  cy.visitMyNotebooks();
  cy.findNoteCardButton(noteTitle, ".edit-subscription").click();
  cy.findByRole('button', {name: "Update"}).click();
});

When("I change notebook {string} to skip review", (noteTitle) => {
  cy.visitMyNotebooks();
  cy.findNoteCardButton(noteTitle, ".edit-notebook").click();
  cy.getFormControl("SkipReviewEntirely").check();
  cy.findByRole('button', {name: "Update"}).click();
});

