describe('unhide sections spec', () => {
  beforeEach(() => {
    cy.visit('/webyarns-skip-autoslide.html')
  })

  it('should show hidden section after auto-slide', () => {
    cy.clock();

    cy.nextSlide()
    cy.currentSlide().should('have.id',"autoslide")
    cy.tick(200)
    cy.currentSlide().should('have.id',"s3")
  })






})
