
describe('unhide sections spec', () => {


    it('should disable arrow', () => {
        cy.visit('/webyarns-disable-keyboard.html#/disable-keyboard')
        // right key
        cy.get("body").type("{rightArrow}")
        cy.currentSlide().should('have.id',"disable-keyboard")

        // right key
        cy.get("body").type("{leftArrow}")
        cy.currentSlide().should('have.id',"disable-keyboard")

        // right key
        cy.get("body").type(" ")
        cy.currentSlide().should('have.id',"disable-keyboard")


    })
    it('should disable space', () => {
        cy.visit('/webyarns-disable-keyboard.html#/disable-keyboard')

        cy.get("body").type(" ")
        cy.currentSlide().should('have.id',"disable-keyboard")
    })

})
