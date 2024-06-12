import { assumeChatAboutNotePage } from "./chatAboutNotePage"
import submittableForm from "../submittableForm"
import noteCreationForm from "./noteForms/noteCreationForm"
import { commonSenseSplit } from "support/string_util"
import { questionListPage } from "./questionListPage"

function filterAttributes(attributes: Record<string, string>, keysToKeep: string[]) {
  return Object.keys(attributes)
    .filter((key) => keysToKeep.includes(key))
    .reduce(
      (obj, key) => {
        const val = attributes[key]
        if (val) {
          obj[key] = val
        }
        return obj
      },
      {} as Record<string, string>,
    )
}

export const assumeNotePage = (noteTopic?: string) => {
  const findNoteTopic = (topic) => cy.findByText(topic, { selector: "[role=topic] *" })

  if (noteTopic) {
    findNoteTopic(noteTopic)
  }

  const privateToolbarButton = (btnTextOrTitle: string) => {
    const getButton = () => cy.findByRole("button", { name: btnTextOrTitle })
    return {
      click: () => {
        getButton().click()
        return { ...submittableForm }
      },
      clickIfNotOpen: () => {
        getButton().then(($btn) => {
          if ($btn.attr("aria-expanded") === "false") {
            cy.wrap($btn).click()
          }
        })
      },
      shouldNotExist: () => getButton().should("not.exist"),
    }
  }

  const clickNotePageMoreOptionsButton = (btnTextOrTitle: string) => {
    privateToolbarButton("more options").click()
    privateToolbarButton(btnTextOrTitle).click()
  }

  return {
    navigateToChild: (noteTopic: string) => {
      cy.get("main").within(() => {
        cy.findCardTitle(noteTopic).click()
      })
      return assumeNotePage(noteTopic)
    },
    collapseChildren: () => {
      cy.get("main").within(() => {
        cy.findByRole("button", { name: "collapse children" }).click()
      })
    },
    expandChildren: () => {
      cy.findByRole("button", { name: "expand children" }).click()
    },
    expectChildren: (children: Record<string, string>[]) => {
      cy.get("main").within(() => {
        cy.expectNoteCards(children)
      })
    },

    linkNoteTo: (target: string) => {
      const findLink = () =>
        cy.findByText(target, { selector: "main .topic-text" }).parent().parent().parent()
      return {
        linkType: (linkType: string) => {
          findLink().findAllByText(linkType, {
            selector: ".link-type",
          })
        },
        goto: () => {
          findLink().get(".link-type").click()
        },
      }
    },

    expectLinkingTopic: function (linkType: string, target: string) {
      this.linkNoteTo(target).linkType(linkType)
    },

    navigateToLinkingChild: function (targetNoteTopic: string) {
      this.linkNoteTo(targetNoteTopic).goto()
      return assumeNotePage()
    },
    expectLinkingChildren: function (linkType: string, targetNoteTopics: string) {
      cy.get("main").within(() => {
        commonSenseSplit(targetNoteTopics, ",").forEach((target) => {
          this.expectLinkingTopic(linkType, target)
        })
      })
    },
    changeLinkType: function (linkType: string, target: string) {
      cy.findByRole("topic").click()
      cy.clickRadioByLabel(linkType)
      cy.pageIsNotLoading()
      this.expectLinkingTopic(linkType, target)
    },

    navigateToReference: (referenceTopic: string) => {
      cy.get("main").within(() => {
        cy.findByText(referenceTopic, { selector: ".link-link .topic-text" }).click()
      })
      return assumeNotePage()
    },
    collapsedChildrenWithCount: (count: number) => {
      cy.findByText(count, { selector: "[role=collapsed-children-count]" })
    },
    findNoteDetails: (expected: string) => {
      expected.split("\\n").forEach((line) => cy.get("[role=details]").should("contain", line))
    },
    toolbarButton: (btnTextOrTitle: string) => {
      return privateToolbarButton(btnTextOrTitle)
    },
    editNoteImage() {
      return this.toolbarButton("edit note image")
    },
    editAudioButton() {
      return this.toolbarButton("Upload audio")
    },
    downloadAudioFile(fileName: string) {
      const downloadsFolder = Cypress.config("downloadsFolder")
      cy.findByRole("button", { name: `Download ${fileName}` }).click()
      cy.task("fileShouldExistSoon", downloadsFolder + "/" + fileName).should("equal", true)
    },
    updateNoteImage(attributes: Record<string, string>) {
      this.editNoteImage()
        .click()
        .submitWith(filterAttributes(attributes, ["Upload Image", "Image Url", "Use Parent Image"]))
      return this
    },
    updateNoteUrl(attributes: Record<string, string>) {
      this.toolbarButton("edit note url")
        .click()
        .submitWith(filterAttributes(attributes, ["Url"]))
      return this
    },

    startSearchingAndLinkNote() {
      this.toolbarButton("search and link note").click()
    },
    addingChildNote() {
      cy.pageIsNotLoading()
      this.toolbarButton("Add Child Note").click()
      return noteCreationForm
    },
    aiGenerateImage() {
      clickNotePageMoreOptionsButton("Generate Image with DALL-E")
    },
    deleteNote() {
      clickNotePageMoreOptionsButton("Delete note")
      cy.findByRole("button", { name: "OK" }).click()
      cy.pageIsNotLoading()
    },
    openQuestionList() {
      clickNotePageMoreOptionsButton("Questions for the note")
      return questionListPage()
    },
    addQuestion(row: Record<string, string>) {
      this.openQuestionList().addQuestion(row)
    },
    approveQuiz(question: string) {
      this.openQuestionList()
      const id = "checkbox-" + question
      const escapedId = id.replace(/\s/g, "\\ ")
      cy.get(`[type="checkbox"][id="${escapedId}"]`).check() //call api to save data
    },
    expectQuestionsInList(expectedQuestions: Record<string, string>[]) {
      this.openQuestionList().expectQuestion(expectedQuestions)
    },
    expectApprovedQuestionsInList(expectedQuestions: Record<string, boolean>[]) {
      this.openQuestionList().expectApprovedQuestion(expectedQuestions)
    },
    aiSuggestDetailsForNote: () => {
      cy.on("uncaught:exception", () => {
        return false
      })
      cy.findByRole("button", { name: "auto-complete details" }).click()
    },
    chatAboutNote() {
      this.toolbarButton("Chat with AI").click()
      return assumeChatAboutNotePage()
    },
    moveUpAmongSiblings() {
      cy.pageIsNotLoading()
      this.toolbarButton("Move up").click()
    },
    moveDownAmongSiblings() {
      cy.pageIsNotLoading()
      this.toolbarButton("Move down").click()
    },
    wikidataOptions() {
      const openWikidataOptions = () => privateToolbarButton("wikidata options").clickIfNotOpen()

      return {
        associate(wikiID: string) {
          privateToolbarButton("associate wikidata").click()
          cy.replaceFocusedTextAndEnter(wikiID)
        },
        reassociationWith(wikiID: string) {
          openWikidataOptions()
          privateToolbarButton("Edit Wikidata Id").click()
          cy.replaceFocusedTextAndEnter(wikiID)
        },
        hasAssociation() {
          openWikidataOptions()
          const elm = () => {
            return cy.findByRole("button", { name: "Go to Wikidata" })
          }
          elm()

          return {
            expectALinkThatOpensANewWindowWithURL(url: string) {
              cy.window().then((win) => {
                const popupWindowStub = { location: { href: undefined }, focus: cy.stub() }
                cy.stub(win, "open").as("open").returns(popupWindowStub)
                elm().click()
                cy.get("@open").should("have.been.calledWith", "")
                // using a callback so that cypress can wait until the stubbed value is assigned
                cy.wrap(() => popupWindowStub.location.href)
                  .should((cb) => expect(cb()).equal(url))
                  .then(() => {
                    expect(popupWindowStub.focus).to.have.been.called
                  })
              })
            },
          }
        },
      }
    },
    goToAddQuestion() {
      cy.findByRole("button", { name: "more options" }).click()
      cy.findByRole("button", { name: "Questions for the note" }).click()
      cy.findByRole("button", { name: "Add Question" }).click()
    },
    injectSomeDataQuestion(row: Record<string, string>) {
      cy.findByLabelText("Stem").type(row["Stem"]!)
      cy.findByLabelText("Choice 0").type(row["Choice 0"]!)
      cy.findByLabelText("Choice 1").type(row["Choice 1"]!)
      cy.findByLabelText("Correct Choice Index").clear().type(row["Correct Choice Index"]!)
    },
    verifyRefineQuestion(row: Record<string, string>) {
      cy.findByLabelText("Stem").invoke("val").should("not.eq",row["Stem"]!)
      cy.findByLabelText("Choice 0").invoke("val").should("not.eq",row["Choice 0"]!)
      cy.findByLabelText("Choice 1").invoke("val").should("not.eq",row["Choice 1"]!)
    },
    verifyCorrectIndex: (index : string) => {
      cy.findByLabelText("Correct Choice Index").invoke("val").should("eq",index)
    },
  }
}
