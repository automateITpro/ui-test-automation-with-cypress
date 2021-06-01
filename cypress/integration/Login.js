describe('Automation Practice Login', () => {

    beforeEach(() => {
      cy.fixture('users.json').as('users')
      cy.visit('')
    })

    it('has correct login form title', () => {
      cy.get('a[class="login"]').click()
      cy.get('h1').should('have.text', 'Authentication')
    })

    it('allows log in with correct username and password', function () {
      const user = this.users[0]
      
      cy.login(user.email, user.password)
      cy.url().should('include', 'my-account')
    })

  })