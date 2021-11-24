describe('unhide sections spec', () => {
  beforeEach(() => {
    cy.visit('/webyarns-autoslide.html')
  })

  it('should show hidden section after auto-slide', () => {
    cy.clock();
    cy.currentSlide().contains('START',{matchCase: false})
    cy.nextSlide()
    cy.currentSlide().contains('with next slide is hidden',{matchCase: false})
    cy.tick(200)
    cy.currentSlide().contains('after autoslide',{matchCase: false})
  })






})
