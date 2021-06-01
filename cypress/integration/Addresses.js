// -- Start: Address Utils --

var user

function goToAddresses() {
    cy.visit('index.php?controller=addresses')
}

function setAddressData() {
    const address = {
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      addressLine1: "Gatvė X - 22",
      city: "Vilnius",
      state: "Florida",
      postCode: "22222",
      country: "United States",
      mobilePhone: "222222222",
      title: 'Address ' + new Date().toLocaleString()
    }
    return address
  }

  function addAddress(address) {
    cy.get('a[title="Add an address"]').click()
  
    // leave default name and company values
    // TODO: verify them
    cy.get('#address1').type(address.addressLine1)
    cy.get('#city').type(address.city)
    cy.get('#id_state').select(address.state)
    cy.get('#postcode').type(address.postCode)
    cy.get('#phone_mobile').type(address.mobilePhone)
    cy.get('#alias').clear().type(address.title)
  
    cy.get('#submitAddress').click()
  }

  function verifyAddressListIsShown() {
    cy.get('h1').should('have.text', 'My addresses')
  }
  
  function verifyNewAddressIsInList(title) {
    cy.contains('h3', title).should('be.visible')
  }

  function verifyAddressDetails(address) {
    cy.contains(address.title)
    .parents('ul')
    .within(() => {
      cy.get('.address_name').eq(0).should('contain.text', address.firstName)
      cy.get('.address_name').eq(1).should('contain.text', address.lastName)
      cy.get('.address_company').should('contain.text', address.company)
      cy.get('.address_address1').should('contain.text', address.addressLine1)
      cy.get('li').eq(4).find('span').eq(0).should('contain.text', address.city)
      cy.get('li').eq(4).find('span').eq(1).should('contain.text', address.state)
      cy.get('li').eq(4).find('span').eq(2).should('contain.text', address.postCode)
      cy.get('li').eq(5).find('span').should('contain.text', address.country)  
      cy.get('.address_phone_mobile').should('contain.text', address.mobilePhone)  
    })
  }

  function getAddresses() {
    return cy.get('h3.page-subheading')
  }

  function storeLastAddressDetails() {
    var address = {}
    cy.get('h3.page-subheading').last().parents('ul')
    .within(() => {
      cy.get('h3.page-subheading').then(($el) => { address.title = $el.text().trim() })
      cy.get('.address_name').eq(0).then(($el) => { address.firstName = $el.text().trim() })
      cy.get('.address_name').eq(1).then(($el) => { address.lastName = $el.text().trim() })
      cy.get('.address_company').then(($el) => { address.company = $el.text().trim() })
      cy.get('.address_address1').then(($el) => { address.addressLine1 = $el.text().trim() })
      cy.get('.address_address2').then(($el) => { address.addressLine2 = $el.text().trim() })
      cy.get('li').eq(4).find('span').eq(0).then(($el) => { address.city = $el.text().trim() })
      cy.get('li').eq(4).find('span').eq(1).then(($el) => { address.state = $el.text().trim() })
      cy.get('li').eq(4).find('span').eq(2).then(($el) => { address.postCode = $el.text().trim() })
      cy.get('li').eq(5).find('span').then(($el) => { address.country = $el.text().trim() })
      cy.get('.address_phone').then(($el) => { address.phone = $el.text().trim() })
      cy.get('.address_phone_mobile').then(($el) => { address.mobilePhone = $el.text().trim() })
    })
    return address
  }

  function updateLastAddress(address) {
    cy.get('a[title=Update]').last().click()
  
    cy.get('#firstname').clear().type(address.firstName)
    cy.get('#lastname').clear().type(address.lastName)
    cy.get('#company').clear().type(address.company)
    cy.get('#address1').clear().type(address.addressLine1)
    cy.get('#address2').clear().type(address.addressLine2)
    cy.get('#city').clear().type(address.city)
    cy.get('#id_state').select(address.state)
    cy.get('#postcode').clear().type(address.postCode)
    //country has only one and mandatory option, not possible to update
    cy.get('#phone').clear().type(address.phone)
    cy.get('#phone_mobile').clear().type(address.mobilePhone)
    cy.get('#alias').clear().type(address.title)
  
    cy.get('#submitAddress').click()
  }
  
// -- End: Address Utils --
  
// -- Start: Tests --  

describe('User addresses', () => {

    before(function () {
        cy.visit('')
        cy.fixture('users.json').then((users) => {
          user = users[0]
          cy.login(user.email, user.password)
        })
    })
  
    beforeEach(function () {
        cy.preserveAllCookiesOnce()
        goToAddresses()
    }) 

    it('should allow user add address under her account', () => {
        getAddresses().then($addressesBefore => {
            const initialCount = $addressesBefore.length
    
            const address = setAddressData()
            addAddress(address)
      
            verifyAddressListIsShown()
            verifyNewAddressIsInList(address.title)
            verifyAddressDetails(address)
            getAddresses().then($addressesAfter => {
              expect($addressesAfter.length).to.be.greaterThan(initialCount)
            })
        })
    })

    it('should allow user edit address under her account', () => {
          cy.wrap(storeLastAddressDetails()).then($address => {
            $address.title = 'Updated ' + new Date().toLocaleString()
            $address.addressLine1 = 'Gatvė Y - ' + new Date().toLocaleString()
            $address.postCode = Math.floor(Math.random() * 89999 + 10000)
            
            updateLastAddress($address)
            verifyAddressDetails($address)
        })
    })

    // Open Developer Tools -> Console
    it.skip('debugs addresses', () => {
        cy.get('h3').debug()
    })

    after(function () {
        cy.get('a.logout').click()
    })

})

// -- End: Tests --

