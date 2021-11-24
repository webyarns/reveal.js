describe('data-auto-move-to', () => {


  it('should work with numbers', () => {
    cy.clock();
    cy.visit('webyarns-demo-timed.html#/s1')
    cy.tick(5000)
    cy.currentSlide().should('have.id',"s0")
  })

  it('should work with ids', () => {
    cy.clock();
    cy.visit('webyarns-demo-timed.html#/s2')
    cy.tick(2000)
    cy.currentSlide().should('have.id',"test")
  })

  it('should work with hash', () => {
    cy.clock();
    cy.visit('webyarns-demo-timed.html#/s3')
    cy.tick(2000)
    cy.currentSlide().should('have.id',"test")
  })

  it('should work with random', () => {
    cy.clock();
    cy.visit('webyarns-demo-timed.html#/s4')
    cy.tick(2000)
    cy.currentSlide().should('not.have.id',"s4")
  })




  it('should honour the time', () => {
    cy.clock();
    cy.visit('webyarns-demo-timed.html#/s1')
    cy.tick(4500)
    cy.currentSlide().should('have.id',"s1")
    cy.tick(500)
    cy.currentSlide().should('have.id',"s0")
  })


  it('should have a default time of 1ms', () => {
    cy.clock();
    cy.visit('webyarns-demo-timed.html#/s2')
    cy.tick(1)
    cy.currentSlide().should('have.id',"test")
  })


})
