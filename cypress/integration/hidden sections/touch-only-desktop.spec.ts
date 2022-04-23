describe('data-touch-only-section', () => {

    it('Should be hidden on non-touch', () => {
        cy.visit('webyarns-touch-dependent.html#/s0')
        cy.nextSlide()
        cy.currentSlide().should('have.id', "s2")
    })

    it('Should be skipped from data-autoslide', () => {
        cy.clock();
        cy.visit('webyarns-touch-dependent.html#/s5')
        cy.tick(200)
        cy.currentSlide().should('have.id', "s7")
    })

})


describe('data-non-touch-only-section', () => {

    it('Should be visible on non-touch', () => {
        cy.visit('webyarns-touch-dependent.html#/s2')
        cy.nextSlide()
        cy.currentSlide().should('have.id', "s3")
    })


})

