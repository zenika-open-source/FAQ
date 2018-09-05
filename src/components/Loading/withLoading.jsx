/* eslint react/display-name: 0 react/prop-types: 0 */
import React from 'react'

import Loading from './Loading'

const withLoading = (text = 'Loading...') => Component => {
  const withLoadingWrapper = props => {
    if (props.loading) return text !== false ? <Loading text={text} /> : null

    return <Component {...props} />
  }

  return withLoadingWrapper
}

export default withLoading
