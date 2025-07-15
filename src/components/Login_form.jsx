// Kirjautumislomakkeen komponentti

import PropTypes from 'prop-types'

// Tuodaan funktiot ja tilat App.jsx:stä
const LoginForm = ({
  handleSubmit,                                                               // Funktio joka käsittelee kirjautumisen
  handleUsernameChange,                                                       // Funktio joka päivittää username-staten
  handlePasswordChange,                                                       // Funktio joka päivittää password-staten
  username,                                                                   // Nykyinen käyttäjätunnus
  password                                                                    // Nykyinen salasana
}) => {


  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>

        {/* KÄYTTÄJÄTUNNUS-KENTTÄ */}
        <div className="form-field">
          <label>username:</label>
          <input
            id="username"                                                     // ID yhdistää labelin ja inputin (accessibility + testability)
            type="text"                                                       // Tavallinen tekstikenttä
            value={username}                                                  // Arvo tulee App.jsx:n tilasta
            autoComplete="username"                                           // Selain voi ehdottaa tallennettuja käyttäjätunnuksia
            onChange={handleUsernameChange}                                   // Kun käyttäjä kirjoittaa, kutsutaan App.jsx:n funktiota handleUsernameChange
          />
        </div>

        {/* SALASANA-KENTTÄ */}
        <div className="form-field">
          <label>password:</label>
          <input
            id="password"                                                     // ID yhdistää labelin ja inputin (accessibility + testability)
            type="password"                                                   // Salasanakenttä (piilottaa tekstin)
            value={password}                                                  // Arvo tulee App.jsx:n tilasta
            autoComplete="current-password"                                   // Selain voi ehdottaa tallennettuja salasanoja
            onChange={handlePasswordChange}                                   // Kun käyttäjä kirjoittaa, kutsutaan App.jsx:n funktiota handlePasswordChange
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

// Määrittelee mitä propseja komponentti odottaa
LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,                                  // Pakollinen funktio lomakkeen lähetykseen
  handleUsernameChange: PropTypes.func.isRequired,                          // Pakollinen funktio käyttäjätunnuksen muutokseen
  handlePasswordChange: PropTypes.func.isRequired,                          // Pakollinen funktio salasanan muutokseen
  username: PropTypes.string.isRequired,                                    // Pakollinen merkkijono (nykyinen käyttäjätunnus)
  password: PropTypes.string.isRequired                                     // Pakollinen merkkijono (nykyinen salasana)
}

export default LoginForm