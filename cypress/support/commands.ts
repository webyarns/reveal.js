/// <reference types="cypress" />


declare namespace Cypress {
    interface Chainable<Subject>  {
        currentSlide(): Chainable<Subject>
        nextSlide(): Chainable<Subject>
        previousSlide(): Chainable<Subject>
        swipeToLeft(): Chainable<Subject>
        swipeToRight(): Chainable<Subject>
    }
}

Cypress.Commands.add('currentSlide', () => cy.get("section.present",{timeout:500}))
Cypress.Commands.add('nextSlide', () => cy.get("body").type("{rightArrow}"))
Cypress.Commands.add('previousSlide', () => cy.get("body").type("{leftArrow}"))

Cypress.Commands.add('swipeToLeft', () => cy.get('body')
    .trigger('pointerdown', { which: 1 })
    .trigger('pointermove', 'right')
    .trigger('pointerup', { force: true }))
Cypress.Commands.add('swipeToRight', () => cy.get('body')
    .trigger('pointerdown', { which: 1 })
    .trigger('pointermove', 'left')
    .trigger('pointerup', { force: true }))
