describe('data-next-slide-indexh', () => {


  it('should navigate to specified slide on right', () => {
    cy.visit('webyarns-prev-next-slides.html#/slide-1')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s-idx=4")
  })

  it('should not navigate to specified slide on left', () => {
    cy.visit('webyarns-prev-next-slides.html#/slide-1')
    cy.previousSlide()
    cy.currentSlide().should('have.id',"slide-0")
  })

  it('should work with ids', () => {
    cy.visit('webyarns-prev-next-slides.html#/slide-5')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s-idx=4")
  })


})


describe('data-previous-slide-indexh', () => {

  it('should  navigate to specified slide on right', () => {
    cy.visit('webyarns-prev-next-slides.html#/slide-2')
    cy.previousSlide()
    cy.currentSlide().should('have.id',"s-idx=4")
  })

  it('should not  navigate to specified slide on right', () => {
    cy.visit('webyarns-prev-next-slides.html#/slide-2')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"slide-3")
  })

  it('should work with ids', () => {
    cy.visit('webyarns-prev-next-slides.html#/slide-6')
    cy.previousSlide()
    cy.currentSlide().should('have.id',"s-idx=4")
  })

})
