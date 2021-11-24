describe('unhide sections spec', () => {
  beforeEach(() => {
    cy.visit('/webyarns-hide-section.html')
  })

  it('should show hidden section after auto-slide', () => {
    cy.nextSlide();
    cy.nextSlide();
    cy.currentSlide().should('have.id',"end")
  })
})
