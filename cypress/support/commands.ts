// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getcy', (cyid: string) => cy.get(`[data-cy=${cyid}]`))

Cypress.Commands.overwrite(
  'visit',
  (
    original: typeof cy.visit,
    path: string,
    options: Partial<Cypress.VisitOptions>
  ) => {
    original(path, {
      ...options,
      onBeforeLoad: win => {
        cy.stub(
          win.navigator.geolocation,
          'getCurrentPosition',
          (onSuccess, onFail) => onFail()
        )

        if (options.onBeforeLoad) {
          options.onBeforeLoad(win)
        }
      }
    })
  }
)
