/// <reference types="cypress" />


declare namespace Cypress {
    interface Chainable<Subject>  {
        currentSlide(): Chainable<Subject>
        nextSlide(): Chainable<Subject>
        previousSlide(): Chainable<Subject>
    }
}

Cypress.Commands.add('currentSlide', () => cy.get("section.present",{timeout:500}))
Cypress.Commands.add('nextSlide', () => cy.get("body").type("{rightArrow}"))
Cypress.Commands.add('previousSlide', () => cy.get("body").type("{leftArrow}"))
