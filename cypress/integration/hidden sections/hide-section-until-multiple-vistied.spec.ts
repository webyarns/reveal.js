describe('data-unhide-after-visited', () => {

  it('s1 should be hidden', () => {
    cy.visit('webyarns-unhide-after-visited-others.html#/s0')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s2")
  })

  it('s1 Should become visible after visiting a+b', () => {
    cy.visit('webyarns-unhide-after-visited-others.html#/s0')
    cy.nextSlide() //s2
    cy.nextSlide() // s-a
    cy.nextSlide() // s-b
    cy.previousSlide() // back to // s-a
    cy.previousSlide() // back to s2
    cy.previousSlide()
    cy.currentSlide().should('have.id',"s1")

  })

  it('s1 Should remain hidden after visiting only a', () => {
    cy.visit('webyarns-unhide-after-visited-others.html#/s0')
    cy.nextSlide() //s2
    cy.nextSlide() // s-a
    cy.previousSlide() // back to // s-a
    cy.previousSlide() // back to s2
    cy.previousSlide()
    cy.currentSlide().should('have.id',"s0")

  })


  it('s7 should be hidden', () => {
    cy.visit('webyarns-unhide-after-visited-others.html#/s6')
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s8")
  })

  it('s7 Should become unlocked after visiting  a', () => {
    cy.visit('webyarns-unhide-after-visited-others.html#/s0')
    cy.nextSlide() //s2
    cy.nextSlide() // s-a
    cy.nextSlide() // s-ab
    cy.nextSlide() // s-s6
    cy.nextSlide()
    cy.currentSlide().should('have.id',"s7")

  })

})

