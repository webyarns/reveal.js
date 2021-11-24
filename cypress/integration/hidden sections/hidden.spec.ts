describe('data-hidden-section', () => {

  it('Should be skipped', () => {
    cy.visit('webyarns-hidden.html#/s1')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s3")
  })

  it('Should be visitable', () => {
    cy.visit('webyarns-hidden.html#/s2')
    cy.currentSlide().should('have.id',"s2")
  })

})

describe('data-right-only-section', () => {
  it("should be visited navigating from the left", ()=>{
    cy.visit('webyarns-hidden.html#/s3')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s4")
  })
  it("should not be visited navigating from the right", ()=>{
    cy.visit('webyarns-hidden.html#/s5')
    cy.previousSlide()
    cy.currentSlide().should('have.id',"s3")
  })
})

describe('data-left-only-section', () => {

  it("should be visited navigating from the right", ()=>{
    cy.visit('webyarns-hidden.html#/s8')
    cy.previousSlide()
    cy.currentSlide().should('have.id',"s7")
  })

  it("should not be visited navigating from the left", ()=>{
    cy.visit('webyarns-hidden.html#/s6')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s8")
  })
})
