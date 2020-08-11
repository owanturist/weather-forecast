describe('App spec', () => {
  it('Shows link', () => {
    cy.visit('/')
    cy.contains('Learn React').should('be.visible')
  })
})
