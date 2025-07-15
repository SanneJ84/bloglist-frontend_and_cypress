
import { render, screen } from '@testing-library/react'                             // render = piirtää komponentin, screen = etsii elementtejä
import userEvent from '@testing-library/user-event'                                 // userEvent = simuloi käyttäjän toimintoja (klikkaukset jne)
import { vi } from 'vitest'                                                         // vi = Vitest mock-funktioiden työkalu
import Blog from './Blog'                                                           // Tuodaan testattava Blog-komponentti
import BlogForm from './NewBlog'                                                    // Tuodaan BlogForm-komponentti (NewBlog.jsx:stä)


// TESTI 1: Testaa että komponentti näyttää otsikon mutta ei URL:ää tai tykkäyksiä oletuksena

test('renders title and author but not url or likes', () => {
  // Luodaan testidata
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 5,
    id: '123',
    user: {
      name: 'Test user',
      username: 'Test username'
    }
  }

  // Luodaan tyhjät mock-funktiot koska Blog-komponentti vaatii ne
  const mockOnLike = () => {}                                                         // Tyhjä funktio like-toimintoa varten
  const mockOnRemove = () => {}                                                       // Tyhjä funktio remove-toimintoa varten

  // "Piirretään" Blog-komponentti muistiin testausta varten
  render(
    <Blog
      blog={blog}                                                                     // Annetaan blog-data
      onLike={mockOnLike}                                                             // Annetaan like-funktio
      onRemove={mockOnRemove}                                                         // Annetaan remove-funktio
      currentUser={{ username: 'Test username' }}                                     // Annetaan nykyinen käyttäjä
    />
  )

  // VARMISTETAAN että otsikko NÄKYY sivulla
  const title = screen.getByText('Test title')                                        // Etsi teksti "Test title" sivulta
  expect(title).toBeDefined()                                                         // Varmista että löytyi (ei ole undefined)

  // VARMISTETAAN että URL ja tykkäykset EIVÄT näy oletusarvoisesti
  const url = screen.queryByText('Test url')                                          // queryByText = ei kaada testiä jos ei löydy
  const likes = screen.queryByText('Likes: 5')                                        // Etsii tarkalleen tekstiä "Likes: 5"

  expect(url).toBeNull()                                                              // null = ei löytynyt (hyvä!)
  expect(likes).toBeNull()                                                            // null = ei löytynyt (hyvä!)
})


// TESTI 2: Testaa että kun painaa "view" nappia, URL, tykkäykset ja author tulevat näkyviin
test('shows url, likes and author when view button is clicked', async () => {
  const user = userEvent.setup()                                                      // Luodaan "virtuaalinen käyttäjä" joka voi klikata

  // Luodaan sama testidata kuin edellisessä testissä, on täällä uudelleen koska jokainen testi on erillinen ja tarvitsee oman datansa
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 5,
    id: '123',
    user: {
      name: 'Test user',
      username: 'Test username'
    }
  }

  // Tyhjät mock-funktiot (ei testata niitä)
  const mockOnLike = () => {}
  const mockOnRemove = () => {}

  // Renderöidään komponentti
  render(
    <Blog
      blog={blog}
      onLike={mockOnLike}
      onRemove={mockOnRemove}
      currentUser={{ username: 'Test username' }}
    />
  )

  // Etsitään "view" nappi ja painetaan sitä
  const button = screen.getByText('view')                                         // Etsi nappi jossa lukee "view"
  await user.click(button)                                                        // Paina nappia (await = odota että toiminto valmistuu)

  // TARKISTUS: Nyt yksityiskohdat pitäisi näkyä
  const url = screen.getByText('Test url')                                        // Nyt URL:n pitäisi näkyä
  const likes = screen.getByText('Likes: 5')                                      // Nyt tykkäysten pitäisi näkyä
  const author = screen.getByText('Author: Test author')                          // Nyt authorin pitäisi näkyä

  // Varmistetaan että kaikki löytyivät
  expect(url).toBeDefined()                                                       // url löytyi
  expect(likes).toBeDefined()                                                     // likes löytyi
  expect(author).toBeDefined()                                                    // author löytyi
})

// TESTI 3: Testaa että kun painaa like-nappia kaksi kertaa, onLike-funktiota kutsutaan kaksi kertaa

test('clicking the like button twice calls event handler twice', async () => {
  // Taas sama testidata kuin aiemmin
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 5,
    id: '123',
    user: {
      name: 'Test user',
      username: 'Test username'
    }
  }

  // TÄRKEÄÄ: Nyt käytämme vi.fn() "vakooja-funktioita"
  const mockOnLike = vi.fn()                                                    // Tämä muistaa kuinka monta kertaa sitä kutsutaan!
  const mockOnRemove = vi.fn()                                                  // Tämäkin muistaa kutsut

  // Renderöidään komponentti mock-funktioilla
  render(
    <Blog
      blog={blog}
      onLike={mockOnLike}                                                       // Annetaan "vakooja-funktio" like-toimintoa varten
      onRemove={mockOnRemove}                                                   // Annetaan "vakooja-funktio" remove-toimintoa varten
      currentUser={{ username: 'Test username' }}
    />
  )

  const user = userEvent.setup()                                                // Luodaan virtuaalinen käyttäjä

  // VAIHE 1: Paina "view" nappia että like-nappi tulee näkyviin
  const viewButton = screen.getByText('view')                                   // Etsi "view" nappi
  await user.click(viewButton)                                                  // Paina sitä (nyt yksityiskohdat näkyvät)

  // VAIHE 2: Etsi like-nappi ja paina sitä KAKSI kertaa
  const likeButton = screen.getByText('Like')                                   // Etsi "Like" nappi (nyt se on näkyvissä)
  await user.click(likeButton)                                                  // 1. klikkaus
  await user.click(likeButton)                                                  // 2. klikkaus

  // TARKISTUS: Varmista että mockOnLike-funktiota kutsuttiin täsmälleen 2 kertaa
  expect(mockOnLike.mock.calls).toHaveLength(2)
  // Selitys: mockOnLike.mock.calls = lista kaikista kutsuista
  // toHaveLength(2) = listan pituuden pitää olla täsmälleen 2
})


// TESTI 4: Testaa että BlogForm kutsuu createBlog-funktiota oikeilla tiedoilla
test('calls createBlog with correct data when form is submitted', async () => {
  const user = userEvent.setup()                                                      // Luodaan "virtuaalinen käyttäjä"

  // Luodaan mock-funktio blogin luomista varten
  const mockCreateBlog = vi.fn()                                                     // Tämä muistaa kuinka monta kertaa sitä kutsutaan

  // Renderöidään BlogForm komponentti, joka käyttää mockCreateBlog funktiota
  render(<BlogForm createBlog={mockCreateBlog} />)


  // Etsitään lomakkeen kentät placeholder-tekstin perusteella
  const titleInput = screen.getByPlaceholderText('Enter blog title')                  // Etsi input kenttä placeholder-tekstin perusteella
  const authorInput = screen.getByPlaceholderText('Enter author name')                // Etsi author-kenttä
  const urlInput = screen.getByPlaceholderText('Enter blog URL')                      // Etsi URL-kenttä

  // Syötetään testidata kenttiin
  await user.type(titleInput, 'Test Blog Title')                                      // Syötä otsikko
  await user.type(authorInput, 'Test Author')                                         // Syötä kirjoittaja
  await user.type(urlInput, 'http://testurl.com')                                     // Syötä URL

  // Etsitään lomakkeen submit-nappi ja painetaan sitä
  const submitButton = screen.getByText('Create')                                     // Etsi "Create" nappi (NewBlog.jsx:ssä napissa lukee "Create")
  await user.click(submitButton)                                                      // Paina submit-nappia

  // TARKISTUKSET: Varmista että mockCreateBlog-funktiota kutsuttiin kerran oikeilla tiedoilla
  expect(mockCreateBlog).toHaveBeenCalledTimes(1)                                     // Varmista että funktiota kutsuttiin täsmälleen kerran

  // Tarkista että funktiolle annettiin oikea blog-objekti
  expect(mockCreateBlog).toHaveBeenCalledWith({                                       // toHaveBeenCalledWith = tarkistaa millä argumenteilla kutsuttiin
    title: 'Test Blog Title',                                                         // Otsikon pitää olla se mitä syötettiin
    url: 'http://testurl.com',                                                        // URL:n pitää olla se mitä syötettiin
    author: 'Test Author'                                                             // Authorin pitää olla se mitä syötettiin
  })

  // Varmista että lomake tyhjentyi onnistuneen lähetyksen jälkeen
  expect(titleInput.value).toBe('')
  expect(authorInput.value).toBe('')
  expect(urlInput.value).toBe('')
})

