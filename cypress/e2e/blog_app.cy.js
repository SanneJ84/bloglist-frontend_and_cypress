describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://[::1]:5173')                                      // Käytetään IPv6-osoitetta koska localhost ei näytä toimivan IPv4:llä
  })

  it('Login form is shown', function() {
    // Sovellus näyttää oletusarvoisesti login-napin (ei itse lomaketta)
    cy.contains('Blog application')
    // Lomake aukeaa kun painetaan login-nappia
    cy.contains('login').click()
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('login fails with wrong password', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('invalid username or password')
    })

    it('login fails with wrong username', function() {
      cy.contains('login').click()
      cy.get('#username').type('wronguser')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title-input').type('creating test blog')
      cy.get('#author-input').type('cypress author')
      cy.get('#url-input').type('http://example.com')
      cy.get('#create-button').click()
      cy.contains('creating test blog')
    })
    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title-input').type('creating test blog')
      cy.get('#author-input').type('cypress author')
      cy.get('#url-input').type('http://example.com')
      cy.get('#create-button').click()

      cy.contains('creating test blog')
      cy.contains('view').click()
      cy.contains('Like').click()
      cy.contains('1')
    })

    it('A blog can be deleted by the user who created it', function() {
      cy.contains('new blog').click()
      cy.get('#title-input').type('blog to be deleted')
      cy.get('#author-input').type('cypress author')
      cy.get('#url-input').type('http://example.com')
      cy.get('#create-button').click()

      cy.contains('blog to be deleted')
      cy.contains('view').click()
      cy.contains('Remove').click()
      cy.get('html').should('not.contain', 'blog to be deleted')
    })

    it('Only the creator can see the delete button', function() {
      // Luodaan blogi nykyisellä käyttäjällä (mluukkai)
      cy.contains('new blog').click()
      cy.get('#title-input').type('blog by mluukkai')
      cy.get('#author-input').type('cypress author')
      cy.get('#url-input').type('http://example.com')
      cy.get('#create-button').click()

      // Varmistetaan että remove-nappi näkyy luojalle
      cy.contains('blog by mluukkai').parent().contains('view').click()
      cy.contains('blog by mluukkai').parent().should('contain', 'Remove')

      // Kirjaudutaan ulos
      cy.contains('log out').click()

      // Luodaan toinen käyttäjä
      const user2 = {
        name: 'Another User',
        username: 'testuser2',
        password: 'password123'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user2)

      // Kirjaudutaan sisään toisena käyttäjänä
      cy.contains('login').click()
      cy.get('#username').type('testuser2')
      cy.get('#password').type('password123')
      cy.get('#login-button').click()

      // Varmistetaan että remove-nappi EI näy toiselle käyttäjälle
      cy.contains('blog by mluukkai').parent().contains('view').click()
      cy.contains('blog by mluukkai').parent().should('not.contain', 'Remove')
    })

    it('Blogs are ordered by likes with the most liked first', function() {
      // Luodaan ensimmäinen blogi
      cy.contains('new blog').click()
      cy.get('#title-input').type('First blog')
      cy.get('#author-input').type('Author 1')
      cy.get('#url-input').type('http://example1.com')
      cy.get('#create-button').click()
      cy.contains('First blog')

      // Luodaan toinen blogi
      cy.contains('new blog').click()
      cy.get('#title-input').type('Second blog', {force: true})
      cy.get('#author-input').type('Author 2', {force: true})
      cy.get('#url-input').type('http://example2.com', {force: true})
      cy.get('#create-button').click({force: true})
      cy.contains('Second blog')

      // Luodaan kolmas blogi
      cy.contains('new blog').click()
      cy.get('#title-input').type('Third blog', {force: true})
      cy.get('#author-input').type('Author 3', {force: true})
      cy.get('#url-input').type('http://example3.com', {force: true})
      cy.get('#create-button').click({force: true})
      cy.contains('Third blog')

      // Annetaan Second blog:lle 3 likea (eniten)
      cy.contains('Second blog').parent().contains('view').click()
      
      cy.contains('Second blog').parent().contains('Like').click()
      cy.wait(2000) // Odota että like päivittyy
      
      cy.contains('Second blog').parent().contains('Like').click()
      cy.wait(2000) // Odota että like päivittyy
      
      cy.contains('Second blog').parent().contains('Like').click()
      cy.wait(2000) // Odota että like päivittyy

      // Annetaan Third blog:lle 1 like (vähiten)
      cy.contains('Third blog').parent().contains('view').click()
      cy.contains('Third blog').parent().contains('Like').click()
      cy.wait(1000)

      // Annetaan First blog:lle 2 likea (keskimmäinen)
      cy.contains('First blog').parent().contains('view').click()
      
      cy.contains('First blog').parent().contains('Like').click()
      cy.wait(2000) // Odota että like päivittyy
      
      cy.contains('First blog').parent().contains('Like').click()
      cy.wait(2000) // Odota että like päivittyy

      // Tarkistetaan järjestys: Second blog (3 likea) → First blog (2 likea) → Third blog (1 like)
      cy.get('.blog').eq(0).should('contain', 'Second blog')
      cy.get('.blog').eq(1).should('contain', 'First blog')
      cy.get('.blog').eq(2).should('contain', 'Third blog')
    })
  })
})