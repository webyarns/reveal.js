describe('unhide sections spec', () => {
  beforeEach(() => {
    cy.visit('/webyarns-hide-after-visit.html')
  })

  it('should show hidden section after auto-slide', () => {
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s1")
    cy.previousSlide()
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s2")
  })






})
