describe('unhide sections spec', () => {
  beforeEach(() => {
    cy.visit('/webyarns-hidenav.html')
  })

  it('should hide controls on a section', () => {
   cy.nextSlide();
   cy.get(".navigate-left").should("be.visible")
    cy.nextSlide();
    cy.get(".navigate-left").should("not.be.visible")
    cy.nextSlide();
    cy.get(".navigate-left").should("be.visible")
  })






})
