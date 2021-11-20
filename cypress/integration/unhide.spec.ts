describe('unhide sections spec', () => {

    it('once should unhide permanently', () => {
        cy.visit('/webyarns-unhide.html#/before-hidden-once')

        // First pass (skips hidden)
        cy.nextSlide()
        cy.currentSlide().contains("after hidden once")

        // Use link to go to hidden section
        cy.currentSlide().within(()=>cy.get("a").click())
        cy.currentSlide().should('have.id',"hidden-once")

        // Go left and then forward again, hidden should be shown
        cy.previousSlide()
        cy.currentSlide().contains("next is hidden")
        cy.nextSlide()
        cy.currentSlide().should('have.id',"hidden-once")

        // Go left and then forward again, hidden should still be shown
        cy.previousSlide()
        cy.nextSlide()
        cy.currentSlide().should('have.id',"hidden-once")
    })

    it('toggle should unhide/hide', () => {
        cy.visit('/webyarns-unhide.html#/before-hidden-toggle')

        // First pass (skips hidden)
        cy.nextSlide()
        cy.currentSlide().contains("after hidden")

        // Use link to go to hidden section
        cy.currentSlide().within(()=>cy.get("a").click())
        cy.currentSlide().should('have.id',"hidden-toggle")

        // Go left and then forward again, hidden should be shown
        cy.previousSlide()
        cy.currentSlide().contains("next is hidden")
        cy.nextSlide()
        cy.currentSlide().should('have.id',"hidden-toggle")

        // Go left and then forward again, hidden should skipped
        cy.previousSlide()
        cy.nextSlide()
        cy.currentSlide().contains("after hidden")
    })


})
