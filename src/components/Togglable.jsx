// TOGGLABLE.JSX: Yleiskäyttöinen "näytä/piilota" komponentti
// ============================================================

// KÄYTTÖTARKOITUS:
// - Käytetään esim. lomakkeiden piilottamiseen/näyttämiseen

import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'


const Togglable = React.forwardRef((props, ref) => {
  
  const [visible, setVisible] = useState(false)

  
  const hideWhenVisible = { display: visible ? 'none' : '' }                  // Jos näkyy → piilota nappi
  const showWhenVisible = { display: visible ? '' : 'none' }                  // Jos ei näky → piilota sisältö

  
  const toggleVisibility = () => {
    setVisible(!visible)                                                      // Vaihda tila vastakkaiseksi
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility                                                        // Anna parent:lle mahdollisuus kutsua tätä funktiota
    }
  })

  return (
    <div>
      
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>

      <div style={showWhenVisible}>
      
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,                                     // Pakolinen: napissa näkyvä teksti
  children: PropTypes.node.isRequired                                           // Pakolinen: sisältö joka näytetään
}

Togglable.displayName = 'Togglable'


export default Togglable