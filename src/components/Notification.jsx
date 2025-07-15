// Yleiskäyttöinen ilmoituskomponentti
// Näyttää onnistumis- ja virheviestit

import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  // Tunnista virheviestit sisällön perusteella
  const isError = message.includes('error') ||
                  message.includes('Error') ||
                  message.includes('failed') ||
                  message.includes('invalid') ||
                  message.includes('wrong') ||
                  message.includes('Login failed') ||
                  message.includes('Network or server issue')

  if (isError) {
    return (
      <div className="error">
        {message}
      </div>
    )
  } else {
    return (
      <div className="success">
        {message}
      </div>
    )
  }
}

Notification.propTypes = {
  message: PropTypes.string
}

export default Notification