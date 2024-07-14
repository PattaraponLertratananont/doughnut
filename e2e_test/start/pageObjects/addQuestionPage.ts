const behavior = {
  fillQuestion(row: Record<string, string>) {
    cy.findByRole('button', { name: '+' }).click()
    ;[
      'Stem',
      'Choice 0',
      'Choice 1',
      'Choice 2',
      'Correct Choice Index',
    ].forEach((key: string) => {
      if (row[key] !== undefined && row[key] !== '') {
        cy.findByLabelText(key).clear().type(row[key]!)
      }
    })
  },
  addQuestion(row: Record<string, string>) {
    this.fillQuestion(row)
    cy.findByRole('button', { name: 'Submit' }).click()
  },
  editQuestion(row: Record<string, string>) {
    ;['Stem', 'Choice 0', 'Choice 1', 'Correct Choice Index'].forEach(
      (key: string) => {
        if (row[key] !== undefined && row[key] !== '') {
          cy.findByLabelText(key).clear({ force: true }).type(row[key]!)
        }
      }
    )
    cy.findByRole('button', { name: 'Submit' }).click()
  },
  generateQuestionByAI() {
    cy.findByRole('button', { name: 'Generate by AI' }).click()
  },
  refineQuestion(row: Record<string, string>) {
    this.fillQuestion(row)
    cy.findByRole('button', { name: 'Refine' }).click()
  },
}

export const addQuestionPage = () => {
  cy.findByRole('button', { name: 'Add Question' }).click()
  return behavior
}

export const editQuestionPage = () => {
  cy.findByRole('button', { name: 'Edit' }).click()
  return behavior
}
