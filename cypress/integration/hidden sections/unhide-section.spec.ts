describe('unhide sections spec', () => {
  beforeEach(() => {
    cy.visit('/webyarns-unhide-section.html')
  })

  it('should show hidden section after auto-slide', () => {
    cy.nextSlide();
    cy.currentSlide().should('have.id',"s2")
    cy.previousSlide();
    cy.currentSlide().should('have.id',"s1")
  })
})
