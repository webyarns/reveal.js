
describe('unhide sections spec', () => {

    const verticalBtns = [".navigate-left",".navigate-right"]
    it('should hide controls on a section', () => {
        cy.visit('/webyarns-hidenav.html')
        cy.nextSlide();
        verticalBtns.forEach(b=>cy.get(b).should("be.visible"))
        cy.nextSlide();
        verticalBtns.forEach(b=>cy.get(b).should("not.be.visible"))
        cy.get(".navigate-left").should("not.be.visible")
        cy.nextSlide();
        verticalBtns.forEach(b=>cy.get(b).should("be.visible"))
    })

    it("should show left button with `keep-left", () => {
        cy.visit('/webyarns-hidenav.html#/keep-left')
        cy.get(".navigate-left").should("be.visible")
        cy.get(".navigate-right").should("not.be.visible")
        cy.nextSlide();
        verticalBtns.forEach(b=>cy.get(b).should("be.visible"))
    })

    xit("should show left button with `impair-right, keep-left ", () => {
        cy.visit('/webyarns-hidenav.html#/keep-left-impair-right')
        cy.get(".navigate-left").should("be.visible")
        cy.get(".navigate-right").should("be.visible")
        const rightBtn = cy.get(".navigate-right")
        rightBtn.should("have.css","color","rgb(255, 0, 0)")
        rightBtn.click()
        cy.currentSlide().should('have.id',"keep-left-impair-right")

    })

    xit("should undo show left button with `impair-right, keep-left ", () => {
        cy.visit('/webyarns-hidenav.html#/keep-left-impair-right')
        // Check undo
        cy.nextSlide();
        verticalBtns.forEach(b=>cy.get(b).should("be.visible"))

    })

})
