Cypress.Commands.overwrite('type', (originalFn, subject, str, options) => { 
    if (str !== '') {
      return originalFn(subject, str, options)
    }
    return subject
  })

Cypress.Commands.add('login', (username, password) => {
    cy.get('a[class="login"]').click()
    cy.get('#email').type(username)
    cy.get('#passwd').type(password)
    cy.get('#SubmitLogin').click()
})

Cypress.Commands.add('preserveAllCookiesOnce', () => {
    cy.getCookies().then(cookies => {
      const namesOfCookies = cookies.map(c => c.name)
      Cypress.Cookies.preserveOnce(...namesOfCookies)
    })
})