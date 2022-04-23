describe('autoslide', () => {

    it('should hide data-hide-from-autoslide', () => {
        cy.visit('/webyarns-skip-autoslide.html#/autoslide1')
        cy.clock();

        cy.tick(200)
        cy.currentSlide().should('have.id', "s3")
    })

    it('should show hidden section after auto-slide', () => {
        cy.clock();
        cy.visit('/webyarns-skip-autoslide.html#/autoslide2')
        cy.tick(200)
        cy.currentSlide().should('have.id', "s4")
    })

    it('should respect hidden with data-autoslide-honor-hidden', () => {
        cy.clock();
        cy.visit('/webyarns-skip-autoslide.html#/autoslide3')
        cy.tick(200)
        cy.currentSlide().should('have.id', "s6")
    })

})
