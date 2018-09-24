import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'

const Random = ({ randomNode }) => {
  if (randomNode.id) {
    return <Redirect to={`/q/${randomNode.question.slug}-${randomNode.id}`} />
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      There is no questions corresponding to your search. Try again later!
    </div>
  )
}

Random.propTypes = {
  randomNode: PropTypes.object.isRequired
}

export default Random
