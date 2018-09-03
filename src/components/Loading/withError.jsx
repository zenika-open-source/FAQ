/* eslint react/display-name: 0 react/prop-types: 0 */
import React from 'react'

const withError = (text = 'Error :(') => Component => props => {
  if (props.error) return text !== false ? <div>{text}</div> : null

  return <Component {...props} />
}

export default withError
