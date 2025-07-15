// Tämä tiedosto sisältää blogien hallintaan liittyvät API-kutsut

import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null                                                                      // Alustetaan token "null":ksi, joka myöhemmin asetetaan kirjautumisen yhteydessä

const setToken = newToken => {                                                        // Asetetaan token, joka lähetetään API-kutsujen mukana
  token = `Bearer ${newToken}`                                                        // Token asetetaan Bearer-muodossa, http-pyyntöjen autentikointia varten
}

const getAll = () => {                                                                // Haetaan kaikki blogipostaukset
  const config = {                                                                    // Määritellään konfiguraatio, joka sisältää autentikointitokenin
    headers: { Authorization: token },                                                // Token lisätään HTTP-pyynnön otsakkeisiin
  }
  const request = axios.get(baseUrl, config)                                          // Tehdään GET-pyyntö blogien hakemiseksi
  return request.then(response => response.data)                                      // Kun vastaus saadaan, palautetaan se data-muodossa
}

const create = async newObject => {                                                   // Uuden blogipostauksen luominen
  const config = {                                                                    // Määritellään konfiguraatio, joka sisältää autentikointitokenin
    headers: { Authorization: token },                                                // Token lisätään HTTP-pyynnön otsakkeisiin
  }

  const response = await axios.post(baseUrl, newObject, config)                       // Tehdään POST-pyyntö uuden blogipostauksen luomiseksi
  return response.data                                                                // Kun vastaus saadaan, palautetaan se data-muodossa
}

const like = async (id) => {                                                         // Blogin tykkääminen erityisellä like-endpointilla
  const config = {                                                                    // Määritellään konfiguraatio, joka sisältää autentikointitokenin
    headers: { Authorization: token },                                                // Token lisätään HTTP-pyynnön otsakkeisiin
  }

  const response = await axios.put(`${baseUrl}/${id}/like`, {}, config)               // Tehdään PUT-pyyntö like-endpointille (tyhjä body)
  return response.data                                                                // Kun vastaus saadaan, palautetaan se data-muodossa
}

const update = async (id, newObject) => {                                             // Blogipostauksen päivittäminen id:n perusteella
  const config = {                                                                    // Määritellään konfiguraatio, joka sisältää autentikointitokenin
    headers: { Authorization: token },                                                // Token lisätään HTTP-pyynnön otsakkeisiin
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)             // Tehdään PUT-pyyntö baseUrl:n ja id:n kanssa, päivittää newObjectin (blogipostauksen) ja mahdollisten asetusten kanssa (config, joka tässä tapauksessa sisältää tokenin)
  return response.data                                                                // Kun vastaus saadaan, palautetaan se data-muodossa
}

const remove = async (id) => {                                                        // Blogipostauksen poistaminen id:n perusteella
  const config = {                                                                    // Määritellään konfiguraatio, joka sisältää autentikointitokenin
    headers: { Authorization: token },                                                // Token lisätään HTTP-pyynnön otsakkeisiin
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)                     // Tehdään DELETE-pyyntö blogin poistamiseksi
  return response.data                                                                // Kun vastaus saadaan, palautetaan se data-muodossa
}

export default { getAll, create, update, setToken, like, remove }
